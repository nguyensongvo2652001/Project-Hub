const promClient = require("prom-client");
const { catchAsync, HandledError } = require("../utils/errorHandling");
const CronJob = require("cron").CronJob;

promClient.collectDefaultMetrics();

const APP_REQUESTS_TOTAL = "app_requests_total";
const APP_PROCESS_TIME_SECONDS = "app_process_time_seconds";
const MAX_FROM = 24 * 60;
const MIN_FROM_DIVIDE_DURATION = 60;

const requestsCounter = new promClient.Counter({
  name: APP_REQUESTS_TOTAL,
  help: "Total number of requests made to the app",
  labelNames: ["timestampInSeconds"],
});

const processTimeSummary = new promClient.Summary({
  name: APP_PROCESS_TIME_SECONDS,
  help: "Process time of requests in seconds",
});

const updateProcessTimeMiddleware = (req, res, next) => {
  const timer = processTimeSummary.startTimer();

  res.on("finish", () => {
    const processTime = timer();

    processTimeSummary.observe(processTime);
  });

  next();
};

const updateRequestsCounterMiddleware = (req, res, next) => {
  const timestampInSeconds = Math.floor(Date.now() / 1000);

  requestsCounter.inc({ timestampInSeconds });

  next();
};

const getNumberOfRequests = catchAsync(async (req, res, next) => {
  //Both duration and from are in minutes
  // from = 30 meaning we will only count number of requests from 30 minutes ago
  // duration = 10 meaning we will group the requests in group of 10 minutes
  // so let's say now is 12:30, then we will return the number of requests from 12:00 => 12:10, 12:10 => 12:20 and 12:20 => 12:30
  const { duration, from } = req.query;

  if (from > MAX_FROM) {
    return res.status(400).json({
      status: "fail",
      message: `Can only retrieve data from less than ${MAX_FROM} minutes ago.`,
    });
  }

  if (from / duration > MIN_FROM_DIVIDE_DURATION) {
    return res.status(400).json({
      status: "fail",
      message: `From / duration must be smaller or equal to ${MIN_FROM_DIVIDE_DURATION}`,
    });
  }

  const metrics = await promClient.register
    .getSingleMetric(APP_REQUESTS_TOTAL)
    .get();
  const allRequestsCount = metrics.values;

  const currentTime = Date.now();
  const currentTimeInSeconds = currentTime / 1000;
  const durationInSeconds = duration * 60;
  const fromInSeconds = from * 60;
  let startTimeInSeconds = currentTimeInSeconds - fromInSeconds;

  const data = [];
  while (startTimeInSeconds < currentTimeInSeconds) {
    const endTimeInSeconds = startTimeInSeconds + durationInSeconds;
    const requestsWithinDuration = allRequestsCount.filter((requestCount) => {
      const { timestampInSeconds } = requestCount.labels;
      return (
        timestampInSeconds >= startTimeInSeconds &&
        timestampInSeconds <= endTimeInSeconds
      );
    });
    data.push({
      time: startTimeInSeconds,
      value: requestsWithinDuration.length,
    });

    startTimeInSeconds = endTimeInSeconds;
  }

  res.status(200).json({
    status: "success",
    data,
  });
});

const getAverageProcessTime = catchAsync(async (req, res, next) => {
  const metrics = await promClient.register
    .getSingleMetric(APP_PROCESS_TIME_SECONDS)
    .get();
  const metricsValues = metrics.values;
  const numberOfRequests = metricsValues[metricsValues.length - 1].value;
  const totalProcessTimeInSeconds =
    metricsValues[metricsValues.length - 2].value;
  const averageProcessTimeInSeconds =
    numberOfRequests === 0 ? 0 : totalProcessTimeInSeconds / numberOfRequests;

  res.status(200).json({
    status: "success",
    data: {
      averageProcessTimeInSeconds,
    },
  });
});

const resetPrometheusMetricsCronJob = () => {
  new CronJob({
    cronTime: "0 0 * * *",
    onTick: () => {
      requestsCounter.reset();
      processTimeSummary.reset();
    },

    start: true,
  });
};

module.exports = {
  updateRequestsCounterMiddleware,
  updateProcessTimeMiddleware,
  getNumberOfRequests,
  getAverageProcessTime,
  resetPrometheusMetricsCronJob,
};
