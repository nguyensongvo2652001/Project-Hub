const mongoose = require("mongoose");
const Task = require("../models/task");

const getTotalAssignedTasksCountInOneProject = async (memberId, projectId) => {
  const result = await Task.aggregate([
    {
      $match: {
        projectId,
        developers: {
          $elemMatch: { $eq: new mongoose.Types.ObjectId(memberId) },
        },
      },
    },
    {
      $group: {
        _id: null,
        tasksCount: { $sum: 1 },
      },
    },
  ]);

  return result[0].tasksCount;
};

const getTotalCompletedTasksCountInOneProject = async (memberId, projectId) => {
  const result = await Task.aggregate([
    {
      $match: {
        projectId,
        developers: {
          $elemMatch: { $eq: new mongoose.Types.ObjectId(memberId) },
        },
        status: "closed",
      },
    },
    {
      $group: {
        _id: null,
        tasksCount: { $sum: 1 },
      },
    },
  ]);

  return result[0].tasksCount;
};

const getPerformanceInOneProject = async (memberId, projectId) => {
  const promises = [
    getTotalAssignedTasksCountInOneProject(memberId, projectId),
    getTotalCompletedTasksCountInOneProject(memberId, projectId),
  ];

  const results = await Promise.all(promises);

  const totalTasksCount = results[0];
  let completionRate = 0;
  if (totalTasksCount !== 0) {
    completionRate = Math.round((results[1] / results[0]) * 100);
  }

  return {
    completionRate,
    totalTasksCount,
  };
};

module.exports = {
  getTotalAssignedTasksCountInOneProject,
  getTotalCompletedTasksCountInOneProject,
  getPerformanceInOneProject,
};
