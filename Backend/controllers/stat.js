const { default: mongoose } = require("mongoose");
const Task = require("../models/task");
const { catchAsync } = require("../utils/errorHandling");

const getProjectTasksStat = async (projectId) => {
  const tasksCountByStatus = await Task.aggregate([
    {
      $match: { projectId: new mongoose.Types.ObjectId(projectId) },
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const tasksStat = { total: 0 };
  for (const tasksCount of tasksCountByStatus) {
    tasksStat.total += tasksCount.count;
    const taskStatus = tasksCount._id;
    tasksStat[taskStatus] = tasksCount.count;
  }

  return tasksStat;
};

const getProjectTasksCompletionRate = async (projectId) => {
  const tasksStat = await getProjectTasksStat(projectId);
  if (tasksStat.total === 0) {
    return 0;
  }

  const numberOfCompletedTasks = tasksStat.closed || 0;
  const completionRate = Math.round(
    (numberOfCompletedTasks / tasksStat.total) * 100
  );
  console.log(completionRate);
  return completionRate;
};

const getProjectCompletedTasksCountByMonth = async (projectId) => {
  const now = new Date();

  // Weird behaviour when trying to create a date by passing arguments to the constructor so have to set it manually
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setDate(1);
  twelveMonthsAgo.setFullYear(now.getFullYear() - 1);

  // Note that this aggregation only shows the result of months with number of completed tasks > 0
  const tasksAggregateResult = await Task.aggregate([
    {
      $match: {
        projectId: new mongoose.Types.ObjectId(projectId),
        status: "closed",
        finishDate: { $ne: null },
      },
    },
    {
      $match: {
        finishDate: {
          $lte: now,
          $gte: twelveMonthsAgo,
        },
      },
    },
    {
      $group: {
        _id: {
          month: { $month: "$finishDate" },
          year: { $year: "$finishDate" },
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: {
        "_id.year": 1,
        "_id.month": 1,
      },
    },
  ]);

  const completedTasksCountByMonth = {};
  const twelveMonthsAgoYear = twelveMonthsAgo.getFullYear();
  const nowYear = now.getFullYear();
  const startMonthIndex = now.getMonth();

  for (let month = startMonthIndex; month <= 11; month++) {
    const key = `${twelveMonthsAgoYear} ${month}`;
    completedTasksCountByMonth[key] = 0;
  }

  for (let month = 1; month <= startMonthIndex; month++) {
    const key = `${nowYear} ${month}`;
    completedTasksCountByMonth[key] = 0;
  }

  for (let stat of tasksAggregateResult) {
    const { year, month } = stat._id;
    completedTasksCountByMonth[`${year} ${month}`] = stat.count;
  }

  return completedTasksCountByMonth;
};

getProjectCompletedTasksCountByMonth("645c37b6de64ba77f21d11f5");

module.exports = {
  getProjectTasksStat,
  getProjectTasksCompletionRate,
  getProjectCompletedTasksCountByMonth,
};
