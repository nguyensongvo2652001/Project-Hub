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
  labelNames: ["timestampInSeconds"],
});

const updateProcessTimeMiddleware = (req, res, next) => {
  const timer = processTimeSummary.startTimer();

  res.on("finish", () => {
    const processTime = timer();

    const timestampInSeconds = Math.floor(Date.now() / 1000);

    processTimeSummary.observe({ timestampInSeconds }, processTime);
  });

  next();
};

const updateRequestsCounterMiddleware = (req, res, next) => {
  const timestampInSeconds = Math.floor(Date.now() / 1000);

  requestsCounter.inc({ timestampInSeconds });

  next();
};

const getMetricsWithinTimeRange = (func, from, duration) => {
  //Both duration and from are in minutes
  // from = 30 meaning we will only count metrics from 30 minutes ago
  // duration = 10 meaning we will group the metrics in group of 10 minutes
  // so let's say now is 12:30, then we will return the metrics from 12:00 => 12:10, 12:10 => 12:20 and 12:20 => 12:30

  if (from > MAX_FROM) {
    throw new HandledError(
      `Can only retrieve data from less than ${MAX_FROM} minutes ago.`,
      400
    );
  }

  if (from / duration > MIN_FROM_DIVIDE_DURATION) {
    throw new HandledError(
      `From / duration must be smaller or equal to ${MIN_FROM_DIVIDE_DURATION}`,
      400
    );
  }

  const currentTime = Date.now();
  const currentTimeInSeconds = currentTime / 1000;
  const durationInSeconds = duration * 60;
  const fromInSeconds = from * 60;
  let startTimeInSeconds = currentTimeInSeconds - fromInSeconds;

  const data = [];
  while (startTimeInSeconds < currentTimeInSeconds) {
    const endTimeInSeconds = startTimeInSeconds + durationInSeconds;
    const result = func(startTimeInSeconds, endTimeInSeconds);
    data.push(result);

    startTimeInSeconds = endTimeInSeconds;
  }

  return data;
};

const getNumberOfRequests = catchAsync(async (req, res, next) => {
  const { duration, from } = req.query;

  const metrics = await promClient.register
    .getSingleMetric(APP_REQUESTS_TOTAL)
    .get();
  const allRequestsCount = metrics.values;

  const countNumberOfRequestsWithinRange = (fromInSeconds, toInSeconds) => {
    const requestsWithinDuration = allRequestsCount.filter((requestCount) => {
      const { timestampInSeconds } = requestCount.labels;
      return (
        timestampInSeconds >= fromInSeconds && timestampInSeconds <= toInSeconds
      );
    });
    return {
      time: fromInSeconds,
      value: requestsWithinDuration.length,
    };
  };

  const data = getMetricsWithinTimeRange(
    countNumberOfRequestsWithinRange,
    from,
    duration
  );

  res.status(200).json({
    status: "success",
    data,
  });
});

const getAverageProcessTime = catchAsync(async (req, res, next) => {
  const { from, duration } = req.query;

  const metrics = await promClient.register
    .getSingleMetric(APP_PROCESS_TIME_SECONDS)
    .get();

  const metricsValues = metrics.values;

  const getAverageProcessTimeWithinRange = (fromInSeconds, toInSeconds) => {
    const qualifiedMetrics = metricsValues.filter((metric) => {
      return (
        metric.labels.timestampInSeconds >= fromInSeconds &&
        metric.labels.timestampInSeconds <= toInSeconds
      );
    });

    const sumOfProcessTime = qualifiedMetrics.reduce((acc, metric) => {
      return acc + metric.value;
    }, 0);
    let averageProcessTimeInMiliseconds = 0;
    if (qualifiedMetrics.length > 0) {
      averageProcessTimeInMiliseconds =
        (sumOfProcessTime / qualifiedMetrics.length) * 1000;
    }

    return {
      time: fromInSeconds,
      value: averageProcessTimeInMiliseconds,
    };
  };

  const data = getMetricsWithinTimeRange(
    getAverageProcessTimeWithinRange,
    from,
    duration
  );

  res.status(200).json({
    status: "success",
    data,
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
