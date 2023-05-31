const CronJob = require("cron").CronJob;
const Notification = require("../models/notification");
const Project = require("../models/project");
const Task = require("../models/task");
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
    detail: task,
  });

  res.status(201).json({
    status: "success",
    data: {
      task,
    },
  });
});

const getAllTasks = crud.getAll(Task);

const getTask = crud.getOne(Task);

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
  getAllTasks,
  updateTask,
  deleteTask,
  getTask,
  searchTasks,
  updateTaskStatusCron,
};
