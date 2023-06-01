const Notification = require("../models/notification");
const Project = require("../models/project");
const ProjectMember = require("../models/projectMember");
const Task = require("../models/task");
const { HandledError, catchAsync } = require("../utils/errorHandling");

const prepareGetAllTasksMiddleware = (req, res, next) => {
  const { projectId } = req.params;

  if (!projectId) {
    return next(
      new HandledError(
        "you must define the id of the project that you want to get the tasks",
        400
      )
    );
  }

  //We will use req.query (query string) to filter out all the tasks that belongs to project with id = projectId
  req.query.projectId = projectId;

  if (!req.query.sort) {
    req.query.sort = "-dateCreated";
  }

  next();
};

const prepareUpdateTaskOnFinishMiddleware = (req, res, next) => {
  req.onFinish = async (req, task) => {
    const project = await Project.findById(task.projectId);
    project.lastChanged = Date.now();
    await project.save();

    await Notification.create({
      initiator: req.user._id,
      type: process.env.NOTIFICATION_UPDATE_TASK_TYPE,
      scope: "project",
      receiver: task.projectId,
      detai: task,
    });
  };

  next();
};

const prepareDeleteTaskOnFinishMiddleware = (req, res, next) => {
  req.onFinish = async (req, task) => {
    const project = await Project.findById(task.projectId);
    project.lastChanged = Date.now();
    await project.save();

    await Notification.create({
      initiator: req.user._id,
      type: process.env.NOTIFICATION_DELETE_TASK_TYPE,
      scope: "project",
      receiver: task.projectId,
      detail: task,
    });
  };

  next();
};

const validateIfUserIsAllowedToMofidyTaskMiddleware = catchAsync(
  async (req, res, next) => {
    console.log(req.params.id);

    const { taskId } = req.params;
    const task = await Task.findById(taskId);

    if (!task) {
      return next(new HandledError(`No tasks found with id = ${taskId}`, 404));
    }

    const notAllowedToModifyTaskError = new HandledError(
      "You are not allowed to modify this task",
      403
    );
    const membership = await ProjectMember.findOne({
      projectId: task.projectId,
      memberId: req.user,
    });

    if (!membership) {
      return next(notAllowedToModifyTaskError);
    }

    if (membership.role === "admin" || membership.role === "owner") {
      return next();
    }

    if (!req.user.equals(task.creator._id)) {
      return next(notAllowedToModifyTaskError);
    }

    next();
  }
);

const validateIfUserIsAllowedToViewTaskMiddleware = catchAsync(
  async (req, res, next) => {
    const { taskId } = req.params;

    const task = await Task.findById(taskId);

    if (!task) {
      return next(
        new HandledError(`No tasks found with id = ${req.params.id}`, 404)
      );
    }

    const membership = await ProjectMember.findOne({
      projectId: task.projectId,
      memberId: req.user,
      status: "done",
    });

    if (!membership) {
      return next(
        new HandledError(`You are not allowed to view this task`, 403)
      );
    }

    next();
  }
);

const filterRequestBodyBeforeUpdateTaskMiddleware = (req, res, next) => {
  const allowedFieldsToUpdate = [
    "startDate",
    "deadline",
    "finishDate",
    "name",
    "type",
    "status",
    "description",
    "developers",
  ];

  const filteredRequestBody = {};

  for (const field of allowedFieldsToUpdate) {
    if (req.body[field]) {
      filteredRequestBody[field] = req.body[field];
    }
  }

  req.body = filteredRequestBody;

  next();
};

//Some controllers will use req.params.id so we need to set it
const setRequestParamsIdMiddleware = (req, res, next) => {
  req.params.id = req.params.taskId;
  next();
};

module.exports = {
  prepareGetAllTasksMiddleware,
  prepareUpdateTaskOnFinishMiddleware,
  prepareDeleteTaskOnFinishMiddleware,
  validateIfUserIsAllowedToMofidyTaskMiddleware,
  validateIfUserIsAllowedToViewTaskMiddleware,
  filterRequestBodyBeforeUpdateTaskMiddleware,
  setRequestParamsIdMiddleware,
};
