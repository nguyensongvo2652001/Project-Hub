const CronJob = require("cron").CronJob;
const Notification = require("../models/notification");
const Project = require("../models/project");
const ProjectMember = require("../models/projectMember");
const Task = require("../models/task");
const User = require("../models/user");
const APIFeatures = require("../utils/apiFeatures");
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

const validateIfUserIsAllowedToGetTaskDetailMiddleware = catchAsync(
  async (req, res, next) => {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return next(
        new HandledError(`No tasks found with id = ${req.params.id}`, 404)
      );
    }

    const membership = await ProjectMember.findOne({
      projectId: task.projectId,
      memberId: req.user._id,
    });

    if (!membership) {
      return next(
        new HandledError(`You are not allowed to view this task`, 403)
      );
    }

    next();
  }
);

const getTask = crud.getOne(Task);

const validateIfUserIsAllowedToMofidyTaskMiddleware = catchAsync(
  async (req, res, next) => {
    const taskId = req.params.id;
    const task = await Task.findById(taskId);

    if (!task) {
      return next(new HandledError(`No tasks found with id = ${taskId}`, 404));
    }

    const membership = await ProjectMember.findOne({
      projectId: task.projectId,
      memberId: req.user._id,
    });
    const notAllowedToModifyTaskError = new HandledError(
      "You are not allowed to modify this task",
      403
    );

    if (!membership) {
      return next(notAllowedToModifyTaskError);
    }

    if (membership.role === "admin" || membership.role === "owner") {
      return next();
    }

    if (!req.user._id.equals(task.creator)) {
      return next(notAllowedToModifyTaskError);
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
    });
  };

  next();
};

const updateTask = crud.updateOne(Task);
const deleteTask = crud.deleteOne(Task);

const searchTasks = catchAsync(async (req, res, next) => {
  let { q } = req.query;

  if (!q) {
    q = "";
  }

  const searchQuery = { $regex: q, $options: "i" };

  const query = Task.find({
    $or: [
      { name: searchQuery },
      { description: searchQuery },
      { status: searchQuery },
      { type: searchQuery },
    ],
    projectId: req.params.projectId,
  });

  const queryString = req.query;

  if (!queryString.sort) {
    queryString.sort = "-dateCreated";
  }

  const features = new APIFeatures(query, queryString)
    .sort()
    .limitFields()
    .paginate();

  const tasks = await features.query;

  res.status(200).json({
    status: "success",
    data: {
      length: tasks.length,
      tasks,
    },
  });
});

const updateTaskStatusCron = () => {
  new CronJob({
    cronTime: "0 0 * * *",
    onTick: async () => {
      try {
        const overdueTasks = await Task.find({ deadline: { $lt: Date.now() } });

        const overdueTasksId = overdueTasks.map((task) => task._id);

        await Task.updateMany(
          { _id: { $in: overdueTasksId } },
          { $set: { status: "overdue" } }
        );
      } catch (error) {
        console.error(
          `Something went wrong updating task status using cron: ${error}`
        );
      }
    },
    start: true,
  });
};

module.exports = {
  createTask,
  prepareGetAllTasksQuery,
  getAllTasks,
  validateIfUserIsAllowedToMofidyTaskMiddleware,
  filterRequestBodyBeforeUpdateTaskMiddleware,
  prepareUpdateTaskOnFinishMiddleware,
  prepareDeleteTaskOnFinishMiddleware,
  updateTask,
  deleteTask,
  validateIfUserIsAllowedToGetTaskDetailMiddleware,
  getTask,
  searchTasks,
  updateTaskStatusCron,
};
