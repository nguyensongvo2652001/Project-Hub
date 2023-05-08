const Notification = require("../models/notification");
const Project = require("../models/project");
const Task = require("../models/task");
const { catchAsync, HandledError } = require("../utils/errorHandling");
const crud = require("./crud");

const createTask = catchAsync(async (req, res, next) => {
  const { projectId, name, description, type, developers } = req.body;

  const task = await Task.create({
    projectId,
    name,
    description,
    type,
    developers,
    creator: req.user._id,
  });

  const project = await Project.findById(projectId);
  project.lastChanged = Date.now();
  await project.save();

  await Notification.create({
    initiator: req.user._id,
    type: process.env.NOTIFICATION_NEW_TASK_TYPE,
    scope: "project",
    receiver: projectId,
  });

  res.status(201).json({
    status: "success",
    data: {
      task,
    },
  });
});

const prepareGetAllTasksQuery = (req, res, next) => {
  const projectId = req.params.projectId;
  if (!projectId) {
    return next(
      new HandledError(
        "you must define the id of the project that you want to get the tasks",
        400
      )
    );
  }

  req.query.projectId = projectId;

  if (!req.query.sort) {
    req.query.sort = "-dateCreated";
  }

  next();
};

const getAllTasks = crud.getAll(Task);

module.exports = { createTask, prepareGetAllTasksQuery, getAllTasks };
