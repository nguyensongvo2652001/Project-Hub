const CronJob = require("cron").CronJob;
const Notification = require("../models/notification");
const Project = require("../models/project");
const ProjectMember = require("../models/projectMember");
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
    .filter()
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

const searchMembersForTask = catchAsync(async (req, res, next) => {
  const { taskId } = req.params;
  const q = req.query.q || "";

  const task = await Task.findById(taskId);
  if (!task) {
    return next(new HandledError(`No tasks found with id = ${taskId}`));
  }
  const taskDeveloperIds = task.developers.map(
    (developer) => `${developer._id}`
  );

  const { projectId } = task;

  const searchQuery = { $regex: q, $options: "i" };

  const query = ProjectMember.find({
    projectId,
  }).populate({
    path: "memberId",
    select: "name email jobTitle description avatar",
    match: {
      $or: [
        { name: searchQuery },
        { email: searchQuery },
        { jobTitle: searchQuery },
        { description: searchQuery },
      ],
    },
  });

  //We have to do this because ProjectMember will populate memberId field (WITHOUT matching) automatically if we don't set skipPopulate
  query.skipPopulate = true;

  const queryString = req.query;
  if (!queryString.sort) {
    queryString.sort = "-dateJoined";
  }

  // The match query in populate does NOT exclude documents that do not match the query, they simply set memberId to null so we can NOT use limit and pagination functions because they will count the non-match docs and we don't want that
  const features = new APIFeatures(query, queryString).sort();

  let members = await features.query;

  // The match query in populate does NOT exclude documents that do not match the query, they simply set memberId to null so we need to filter them out.
  members = members.filter((member) => member.memberId != null);

  const limit = req.query.limit || 10;
  const page = req.query.page || 1;

  const skip = (page - 1) * limit;

  members = members.slice(skip, skip + limit);

  members.map((member) => {
    member.isTaskDeveloper = taskDeveloperIds.includes(
      `${member.memberId._id}`
    );
  });

  res.status(200).json({
    status: "success",
    data: {
      length: members.length,
      members,
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
  searchMembersForTask,
  updateTaskStatusCron,
};
