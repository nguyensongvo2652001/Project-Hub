const User = require("../models/user");
const ProjectMember = require("../models/projectMember");
const { catchAsync } = require("../utils/errorHandling");
const { getOne, updateOne, getAll } = require("./crud");

const allowedUpdateFieldsForUsers = ["name", "jobTitle", "description"];

const prepareUserSelectMiddleware = (req, res, next) => {
  req.selectOptions = "name jobTitle description email";

  next();
};
const getUser = getOne(User);

const prepareUpdateUserRouteMiddleware = (req, res, next) => {
  Object.keys(req.body).forEach((key) => {
    if (!allowedUpdateFieldsForUsers.includes(key)) delete req.body[key];
  });

  req.params.id = req.user._id;

  next();
};

const updateUser = updateOne(User);

const prepareGetAllJoinedProjectsMiddleware = catchAsync(
  async (req, res, next) => {
    const projectIds = await ProjectMember.find({
      memberId: req.user._id,
    }).distinct("projectId");
    req.body = { _id: { $in: projectIds } };
    next();
  }
);

const prepareGetCurrentUserProfileMiddleware = (req, res, next) => {
  req.params.id = req.user._id;
  next();
};

module.exports = {
  prepareUserSelectMiddleware,
  getUser,
  prepareGetAllJoinedProjectsMiddleware,
  prepareGetCurrentUserProfileMiddleware,
  prepareUpdateUserRouteMiddleware,
  updateUser,
};
