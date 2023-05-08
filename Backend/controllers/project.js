const Project = require("../models/project");
const ProjectMember = require("../models/projectMember");
const User = require("../models/user");
const APIFeatures = require("../utils/apiFeatures");
const { catchAsync, HandledError } = require("../utils/errorHandling");
const crud = require("./crud");

const setOwnerId = (req, res, next) => {
  req.body.owner = req.user._id;
  next();
};

const createProject = crud.createOne(Project);

const getProject = catchAsync(async (req, res, next) => {
  const project = await Project.findById(req.params.id)
    .populate({
      path: "owner",
      select: "name",
    })
    .populate("numberOfMembers");

  if (!project) {
    return next(
      new HandledError(`No projects found with id = ${req.params.id}`, 404)
    );
  }

  const membership = await ProjectMember.findOne({
    projectId: project._id,
    memberId: req.user._id,
  });

  if (project.status === "private" && !membership) {
    return next(
      new HandledError(`No projects found with id = ${req.params.id}`, 404)
    );
  }

  if (membership) {
    const tasksCountByType = await project.countTasksByType();
    project.tasksCount = tasksCountByType;
  }

  project.status = undefined;
  res.status(200).json({
    status: "success",
    data: { project },
  });
});

const checkUserIsOwner = catchAsync(async (req, res, next) => {
  const membership = await ProjectMember.findOne({
    memberId: req.user._id,
    projectId: req.params.id,
  });

  if (!membership) {
    return next(
      new HandledError(
        "can not find any membership with the provided data",
        404
      )
    );
  }

  if (membership.role !== "owner") {
    return next(
      new HandledError("only owner is allowed to update the project info", 403)
    );
  }

  next();
});

const checkUserIsMemberOfProject = catchAsync(async (req, res, next) => {
  const projectMember = await ProjectMember.findOne({
    memberId: req.user._id,
    projectId: req.params.projectId,
  });

  if (!projectMember) {
    return next(
      new HandledError(
        `you are not a member of project (id = ${req.params.projectId}) or project id is invalid`,
        400
      )
    );
  }

  next();
});

const filterProjectData = (req, res, next) => {
  const acceptedFields = ["name", "description", "tag", "status"];
  const filteredProjectData = {};

  Object.keys(req.body).forEach((key) => {
    if (acceptedFields.includes(key)) {
      filteredProjectData[key] = req.body[key];
    }
  });

  req.body = filteredProjectData;

  next();
};

const filterOnlyPublicProjectsMiddleware = (req, res, next) => {
  req.body = { status: "public" };

  next();
};

const sortProjectsByDateCreatedMiddleware = (req, res, next) => {
  req.query.sort = "-dateCreated";

  next();
};

const getAllProjects = crud.getAll(Project);
const updateProject = crud.updateOne(Project);

const searchProjects = catchAsync(async (req, res, next) => {
  let { q } = req.query;

  if (!q) {
    q = "";
  }

  const searchQuery = { $regex: q, $options: "i" };

  const possibleOwners = await User.find({
    $or: [
      { name: searchQuery },
      { email: searchQuery },
      { description: searchQuery },
      { jobTitle: searchQuery },
    ],
  });

  const possibleOwnersId = possibleOwners.map((owner) => owner._id);

  const query = Project.find({
    $or: [
      { name: searchQuery },
      { tag: searchQuery },
      { description: searchQuery },
      { owner: { $in: possibleOwnersId } },
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

module.exports = {
  createProject,
  setOwnerId,
  getProject,
  checkUserIsOwner,
  checkUserIsMemberOfProject,
  updateProject,
  filterProjectData,
  getAllProjects,
  filterOnlyPublicProjectsMiddleware,
  sortProjectsByDateCreatedMiddleware,
  searchProjects,
};
