const mongoose = require("mongoose");

const User = require("../models/user");
const ProjectMember = require("../models/projectMember");
const { catchAsync, HandledError } = require("../utils/errorHandling");
const { getOne, updateOne, getAll } = require("./crud");
const APIFeatures = require("../utils/apiFeatures");

const getUser = getOne(User);

const updateUser = updateOne(User);

const getAllJoinedProjects = catchAsync(async (req, res, next) => {
  const limit = req.query.limit || 10;
  const page = req.query.page || 1;

  const skip = (page - 1) * limit;

  //The idea is that we find all membership with memberId = req.user._id (current user id) and then just populate the projectId field of the membership
  const memberships = await ProjectMember.aggregate([
    {
      $match: {
        memberId: new mongoose.Types.ObjectId(req.user._id),
        status: "done",
      },
    },
    {
      $sort: { dateJoined: -1 },
    },
    {
      $lookup: {
        from: "projects",
        localField: "projectId",
        foreignField: "_id",
        as: "project",
      },
    },
    {
      $unwind: "$project",
    },
    {
      $skip: skip,
    },
    {
      $limit: Number(limit),
    },
  ]);
  const joinedProjects = memberships.map((membership) => membership.project);

  res.status(200).json({
    status: "success",
    data: {
      length: joinedProjects.length,
      projects: joinedProjects,
    },
  });
});

const searchUsers = catchAsync(async (req, res, next) => {
  let { q } = req.query;

  if (!q) {
    q = "";
  }

  const searchQuery = { $regex: q, $options: "i" };

  const query = User.find({
    $or: [
      { name: searchQuery },
      { email: searchQuery },
      { description: searchQuery },
      { jobTitle: searchQuery },
    ],
  });

  req.query.fields = "email name jobTitle avatar background description";

  const features = new APIFeatures(query, req.query)
    .sort()
    .limitFields()
    .paginate();

  const users = await features.query;

  res.status(200).json({
    status: "success",
    data: {
      length: users.length,
      users,
    },
  });
});

module.exports = {
  getUser,
  getAllJoinedProjects,
  updateUser,
  searchUsers,
};
