const { default: mongoose } = require("mongoose");
const Task = require("../models/task");
const { catchAsync, HandledError } = require("../utils/errorHandling");
const Project = require("../models/project");

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

  return completionRate;
};

// For instance, if the date is May 2025, this function will only calculate the tasks that have finishDate in May 2025 and will not count tasks that might be finished before that.
const getProjectNewlyCompletedTasksCountByMonthAndYear = async (projectId) => {
  const now = new Date();

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

  for (let monthIndex = startMonthIndex; monthIndex <= 11; monthIndex++) {
    const key = `${twelveMonthsAgoYear} ${monthIndex + 1}`;
    completedTasksCountByMonth[key] = 0;
  }

  for (let monthIndex = 0; monthIndex <= startMonthIndex; monthIndex++) {
    const key = `${nowYear} ${monthIndex + 1}`;
    completedTasksCountByMonth[key] = 0;
  }

  for (let stat of tasksAggregateResult) {
    const { year, month } = stat._id;
    completedTasksCountByMonth[`${year} ${month}`] = stat.count;
  }

  return completedTasksCountByMonth;
};

const getProjectCompletedTasksCountAtSpecificTime = async (
  projectId,
  monthIndex,
  year
) => {
  const completedTasks = await Task.find({
    projectId,
    status: "closed",
    finishDate: {
      $lte: new Date(year, monthIndex + 1, 1),
    },
  });
  return completedTasks.length;
};

const getPromisesForMonthRange = (projectId, startDate, endDate, asyncFunc) => {
  const promises = [];
  for (
    let monthIndex = startDate.getMonth();
    monthIndex <= endDate.getMonth();
    monthIndex++
  ) {
    const year = startDate.getFullYear();
    const promise = asyncFunc(projectId, monthIndex, year);
    promises.push(promise);
  }
  return promises;
};

const getProjectCompletedTasksCountByMonthAndYear = async (projectId) => {
  const now = new Date();
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setFullYear(now.getFullYear() - 1);
  twelveMonthsAgo.setDate(1);

  // For instance, let's say today is May 25th, 2023. Then we want to calculate the number of completed tasks from May => Dec of 2022 and From Jan, 2023 to May 2023
  const asyncFunc = getProjectCompletedTasksCountAtSpecificTime;
  const promises = [
    ...getPromisesForMonthRange(
      projectId,
      twelveMonthsAgo,
      new Date(twelveMonthsAgo.getFullYear(), 11),
      asyncFunc
    ),
    ...getPromisesForMonthRange(
      projectId,
      new Date(now.getFullYear(), 0),
      now,
      asyncFunc
    ),
  ];

  const results = await Promise.all(promises);

  const completedTasksCountByMonthAndYear = {};
  let currentResultIndex = 0;

  for (
    let monthIndex = twelveMonthsAgo.getMonth();
    monthIndex <= 11;
    monthIndex++
  ) {
    const year = twelveMonthsAgo.getFullYear();
    const key = `${year} ${monthIndex + 1}`;
    completedTasksCountByMonthAndYear[key] = results[currentResultIndex];
    currentResultIndex += 1;
  }

  for (let monthIndex = 0; monthIndex <= now.getMonth(); monthIndex++) {
    const year = now.getFullYear();
    const key = `${year} ${monthIndex + 1}`;
    completedTasksCountByMonthAndYear[key] = results[currentResultIndex];
    currentResultIndex += 1;
  }

  return completedTasksCountByMonthAndYear;
};

const getProjectTotalTasksCountAtSpecificTime = async (
  projectId,
  monthIndex,
  year
) => {
  const tasksCreated = await Task.find({
    projectId,
    dateCreated: { $lte: new Date(year, monthIndex + 1, 1) },
  });

  return tasksCreated.length;
};

const getProjectTotalTasksCountByMonthAndYear = async (projectId) => {
  const now = new Date();
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setFullYear(now.getFullYear() - 1);
  twelveMonthsAgo.setDate(1);

  // For instance, let's say today is May 25th, 2023. Then we want to calculate the number of tasks from May => Dec of 2022 and From Jan, 2023 to May 2023
  const asyncFunc = getProjectTotalTasksCountAtSpecificTime;
  const promises = [
    ...getPromisesForMonthRange(
      projectId,
      twelveMonthsAgo,
      new Date(twelveMonthsAgo.getFullYear(), 11),
      asyncFunc
    ),
    ...getPromisesForMonthRange(
      projectId,
      new Date(now.getFullYear(), 0),
      now,
      asyncFunc
    ),
  ];

  const results = await Promise.all(promises);

  const tasksCountByMonthAndYear = {};
  let currentResultIndex = 0;

  for (
    let monthIndex = twelveMonthsAgo.getMonth();
    monthIndex <= 11;
    monthIndex++
  ) {
    const year = twelveMonthsAgo.getFullYear();
    const key = `${year} ${monthIndex + 1}`;
    tasksCountByMonthAndYear[key] = results[currentResultIndex];
    currentResultIndex += 1;
  }

  for (let monthIndex = 0; monthIndex <= now.getMonth(); monthIndex++) {
    const year = now.getFullYear();
    const key = `${year} ${monthIndex + 1}`;
    tasksCountByMonthAndYear[key] = results[currentResultIndex];
    currentResultIndex += 1;
  }

  return tasksCountByMonthAndYear;
};

const getProjectCompletionRateByMonthAndYear = async (projectId) => {
  const projectTotalTasksCountByMonthAndYear =
    await getProjectTotalTasksCountByMonthAndYear(projectId);
  const projectCompletedTasksCountByMonthAndYear =
    await getProjectCompletedTasksCountByMonthAndYear(projectId);

  const projectCompletionRateByMonthAndYear = {};
  for (let key of Object.keys(projectCompletedTasksCountByMonthAndYear)) {
    const totalTasksCount = projectTotalTasksCountByMonthAndYear[key];

    if (totalTasksCount === 0) {
      projectCompletionRateByMonthAndYear[key] = 0;
      continue;
    }

    const totalCompletedTasks = projectCompletedTasksCountByMonthAndYear[key];
    const completionRate = Math.round(
      (totalCompletedTasks / totalTasksCount) * 100
    );

    projectCompletionRateByMonthAndYear[key] = completionRate;
  }

  return projectCompletionRateByMonthAndYear;
};

const getProjectStat = catchAsync(async (req, res, next) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId);
  if (!project) {
    return next(
      new HandledError(`No projects found with id = ${projectId}`, 404)
    );
  }

  const promises = [
    getProjectTasksStat(projectId),
    getProjectTasksCompletionRate(projectId),
    getProjectNewlyCompletedTasksCountByMonthAndYear(projectId),
    getProjectCompletionRateByMonthAndYear(projectId),
  ];

  const results = await Promise.all(promises);

  const stat = {
    tasksStat: results[0],
    completionRate: results[1],
    newlyCompletedTasksCountByMonthAndYear: results[2],
    projectCompletionRateByMonthAndYear: results[3],
  };

  res.status(200).json({
    status: "success",
    data: { stat },
  });
});

module.exports = {
  getProjectStat,
};
