const Task = require("../models/task");
const { catchAsync } = require("../utils/errorHandling");

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

  res.status(201).json({
    status: "success",
    data: {
      task,
    },
  });
});

module.exports = { createTask };
