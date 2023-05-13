const mongoose = require("mongoose");
const Task = require("../models/task");
const { catchAsync } = require("../utils/errorHandling");

const getTasksCountByStatus = async (userId) => {
  const result = await Task.aggregate([
    {
      $match: {
        developers: {
          $elemMatch: { $eq: new mongoose.Types.ObjectId(userId) },
        },
      },
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const tasksCountByStatus = { total: 0 };
  for (let stat of result) {
    const status = stat._id;
    const value = stat.count;
    tasksCountByStatus[status] = value;
    tasksCountByStatus.total += value;
  }

  return tasksCountByStatus;
};

const getKeysBasedOnMonthAndYear = () => {
  // For example, if today is in May 2025, then this function will return a list of keys that look something like this: ["2024 5", "2024 6", "2024 7", ... "2025 4", "2025 5"] (first part is the year, second part is the month)

  const keys = [];
  const now = new Date();
  const twelveMonthsAgo = new Date(now.getFullYear() - 1, now.getMonth(), 1);
  const startMonthIndex = now.getMonth();

  for (let monthIndex = startMonthIndex; monthIndex <= 11; monthIndex++) {
    const key = `${twelveMonthsAgo.getFullYear()} ${monthIndex + 1}`;
    keys.push(key);
  }

  for (let monthIndex = 0; monthIndex <= startMonthIndex; monthIndex++) {
    const key = `${now.getFullYear()} ${monthIndex + 1}`;
    keys.push(key);
  }

  return keys;
};

const getTasksCountByStatusAtSpecificTime = async (
  userId,
  monthIndex,
  year
) => {
  //If we want to count the number of tasks (split by status) by June 2027 that means we just need to count all the tasks that are created BEFORE July 1st 2027
  const results = await Task.aggregate([
    {
      $match: {
        developers: {
          $elemMatch: { $eq: new mongoose.Types.ObjectId(userId) },
        },
        dateCreated: {
          $lt: new Date(year, monthIndex + 1, 1),
        },
      },
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const tasksCountByStatus = {
    total: 0,
  };

  for (let stat of results) {
    const status = stat._id;
    tasksCountByStatus[status] = stat.count;
    tasksCountByStatus.total += stat.count;
  }

  return tasksCountByStatus;
};

const getCompletionRateInEachMonth = async (userId) => {
  const keys = getKeysBasedOnMonthAndYear();
  const promises = keys.map(async (key) => {
    const [year, month] = key.split(" ");
    const tasksCountByStatus = await getTasksCountByStatusAtSpecificTime(
      userId,
      month - 1,
      year
    );
    let completionRate = 0;
    const totalTasksCount = tasksCountByStatus.total;
    const totalCompletedTasks = tasksCountByStatus.closed || 0;
    if (totalTasksCount !== 0)
      completionRate = Math.round(
        (totalCompletedTasks / totalTasksCount) * 100
      );

    return completionRate;
  });

  const results = await Promise.all(promises);
  const completionRateByMonth = {};
  for (let index in keys) {
    const key = keys[index];
    completionRateByMonth[key] = results[index];
  }

  return completionRateByMonth;
};

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

const getPersonalProjectStat = async (userId) => {
  // Need to use name of ProjectMember model instead of ProjectMember model itself due to circular dependency
  const memberships = await mongoose
    .model("ProjectMember")
    .find({ memberId: userId })
    .select("projectId")
    .populate("projectId");

  const getCompletionRatePromises = memberships.map(async (membership) => {
    const performance = await getPerformanceInOneProject(
      userId,
      membership.projectId._id
    );
    return { membership, completionRate: performance.completionRate };
  });

  const getCompletedTasksCountPromises = memberships.map(async (membership) => {
    const completedTasksCount = await getTotalCompletedTasksCountInOneProject(
      userId,
      membership.projectId._id
    );
    return { membership, completedTasksCount };
  });

  const results = await Promise.all([
    Promise.all(getCompletionRatePromises),
    Promise.all(getCompletedTasksCountPromises),
  ]);

  let membershipWithBestCompletionRateInfo = {
    membership: undefined,
    completionRate: -1,
  };
  const membershipCompletionRateResult = results[0];
  for (const stat of membershipCompletionRateResult) {
    const { membership, completionRate } = stat;
    if (completionRate > membershipWithBestCompletionRateInfo.completionRate) {
      membershipWithBestCompletionRateInfo = {
        membership,
        completionRate,
      };
    }
  }

  let membershipWithMostCompletedTasksInfo = {
    membership: undefined,
    completedTasksCount: -1,
  };
  const membershipCompletedTasksResult = results[1];
  for (const stat of membershipCompletedTasksResult) {
    const { membership, completedTasksCount } = stat;
    if (
      completedTasksCount >
      membershipWithMostCompletedTasksInfo.completedTasksCount
    ) {
      membershipWithMostCompletedTasksInfo = {
        membership,
        completedTasksCount,
      };
    }
  }

  return {
    totalProjectsJoined: memberships.length,
    membershipWithBestCompletionRateInfo,
    membershipWithMostCompletedTasksInfo,
  };
};

const getNewlyCompletedTasksInEachMonth = async (userId) => {
  const now = new Date();
  const twelveMonthsAgo = new Date(now.getFullYear() - 1, now.getMonth(), 1);

  const results = await Task.aggregate([
    {
      $match: {
        developers: {
          $elemMatch: { $eq: new mongoose.Types.ObjectId(userId) },
        },
        status: "closed",
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
  ]);

  const newlyCompletedTasksByMonthAndYear = {};
  const keys = getKeysBasedOnMonthAndYear();
  for (let key of keys) newlyCompletedTasksByMonthAndYear[key] = 0;

  for (let stat of results) {
    const { month, year } = stat._id;
    const key = `${year} ${month}`;
    newlyCompletedTasksByMonthAndYear[key] = stat.count;
  }

  return newlyCompletedTasksByMonthAndYear;
};

const getPersonalStat = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const promises = [
    getTasksCountByStatus(userId),
    getPersonalProjectStat(userId),
    getNewlyCompletedTasksInEachMonth(userId),
    getCompletionRateInEachMonth(userId),
  ];
  const results = await Promise.all(promises);

  const stat = {
    tasksCountByStatus: results[0],
    projectStat: results[1],
    newlyCompletedTasksByMonthAndYear: results[2],
    completionRateByMonthAndYear: results[3],
  };
  res.status(200).json({
    status: "success",
    data: {
      stat,
    },
  });
});

module.exports = {
  getTotalAssignedTasksCountInOneProject,
  getTotalCompletedTasksCountInOneProject,
  getPerformanceInOneProject,
  getPersonalStat,
};
