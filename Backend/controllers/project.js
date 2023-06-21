const Notification = require("../models/notification");
const Project = require("../models/project");
const ProjectMember = require("../models/projectMember");
const Task = require("../models/task");
const User = require("../models/user");
const APIFeatures = require("../utils/apiFeatures");
const { catchAsync, HandledError } = require("../utils/errorHandling");
const crud = require("./crud");

const createProject = crud.createOne(Project);

const getProjectPublicDetail = catchAsync(async (req, res, next) => {
  const { projectId } = req.params;

  const project = await Project.findOne({
    _id: projectId,
    status: "public",
  })
    .populate({
      path: "owner",
      select: "name avatar background email",
    })
    .populate("numberOfMembers");

  if (!project) {
    return next(
      new HandledError(`No projects found with id = ${projectId}`, 404)
    );
  }

  res.status(200).json({
    status: "success",
    data: { project },
  });
});

const getProject = catchAsync(async (req, res, next) => {
  const { projectId } = req.params;

  const project = await Project.findOne({
    _id: projectId,
  })
    .populate({
      path: "owner",
      select: "name avatar background email",
    })
    .populate("numberOfMembers");

  if (!project) {
    return next(
      new HandledError(`No projects found with id = ${projectId}`, 404)
    );
  }

  const tasksCountByType = await project.countTasksByType();
  project.tasksCount = tasksCountByType;

  const membersCountByRole = await project.countMembersByRole();
  project.membersCount = membersCountByRole;

  res.status(200).json({
    status: "success",
    data: { project },
  });
});

const getAllProjects = crud.getAll(Project);

const updateProject = crud.updateOne(Project);

const searchProjects = catchAsync(async (req, res, next) => {
  const q = req.query.q || "";

  const searchQuery = { $regex: q, $options: "i" };

  const possibleProjectOwners = await User.find({
    $or: [
      { name: searchQuery },
      { email: searchQuery },
      { description: searchQuery },
      { jobTitle: searchQuery },
    ],
  });

  const possibleProjectOwnersId = possibleProjectOwners.map(
    (owner) => owner._id
  );

  const query = Project.find({
    $or: [
      { name: searchQuery },
      { tag: searchQuery },
      { description: searchQuery },
      { owner: { $in: possibleProjectOwnersId } },
    ],
    status: "public",
  }).populate({
    path: "owner",
    select: "name email jobTitle description",
  });

  const queryString = req.query;

  if (!queryString.sort) {
    queryString.sort = "-dateCreated";
  }

  const features = new APIFeatures(query, queryString)
    .sort()
    .limitFields()
    .paginate();

  const projects = await features.query;

  res.status(200).json({
    status: "success",
    data: {
      length: projects.length,
      projects,
    },
  });
});

const deleteProject = catchAsync(async (req, res, next) => {
  const { projectId } = req.params;

  const project = await Project.findByIdAndDelete(projectId);

  if (!project) {
    return next(
      new HandledError(`no projects found with id = ${projectId}`, 404)
    );
  }

  const deleteAllMembersPromise = ProjectMember.deleteMany({ projectId });
  const deleteAllTasksPromise = Task.deleteMany({ projectId });
  const deleteAllNotificationsPromise = Notification.deleteMany({
    receiver: projectId,
  });

  await Promise.all([
    deleteAllMembersPromise,
    deleteAllNotificationsPromise,
    deleteAllTasksPromise,
  ]);

  res.status(200).json({ status: "success" });
});

module.exports = {
  createProject,
  getProject,
  getProjectPublicDetail,
  updateProject,
  getAllProjects,
  searchProjects,
  deleteProject,
};
