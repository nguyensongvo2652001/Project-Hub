const Project = require("../models/project");
const ProjectMember = require("../models/projectMember");
const User = require("../models/user");
const APIFeatures = require("../utils/apiFeatures");
const { catchAsync, HandledError } = require("../utils/errorHandling");
const crud = require("./crud");

const createProject = crud.createOne(Project);

const getProject = catchAsync(async (req, res, next) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId)
    .populate({
      path: "owner",
      select: "name",
    })
    .populate("numberOfMembers");

  if (!project) {
    return next(
      new HandledError(`No projects found with id = ${projectId}`, 404)
    );
  }

  const membership = await ProjectMember.findOne({
    projectId,
    memberId: req.user,
    status: "done",
  });

  // For private project, only members of those project  can view the project's info.
  if (project.status === "private" && !membership) {
    return next(
      new HandledError(`No projects found with id = ${projectId}`, 404)
    );
  }

  if (membership) {
    const tasksCountByType = await project.countTasksByType();
    project.tasksCount = tasksCountByType;
  }

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

module.exports = {
  createProject,
  getProject,
  updateProject,
  getAllProjects,
  searchProjects,
};
