const promClient = require("prom-client");
const { catchAsync, HandledError } = require("../utils/errorHandling");
const { promisify } = require("util");

promClient.collectDefaultMetrics();

const APP_REQUESTS_TOTAL = "app_requests_total";
const APP_PROCESS_TIME_SECONDS = "app_process_time_seconds";

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

  requestsCounter.inc();
  next();
};

const getNumberOfRequests = catchAsync(async (req, res, next) => {
  const durationInMinutes = req.query.duration || 10;
  const metrics = await promClient.register
    .getSingleMetric(APP_REQUESTS_TOTAL)
    .get();
  const allRequestsCount = metrics.values;

  const currentTimeInSeconds = Date.now() / 1000;
  const durationInSeconds = durationInMinutes * 60;
  const startTimeInSeconds = currentTimeInSeconds - durationInSeconds;

  //We only count the requests that happen within the duration
  const requestsInDuration = allRequestsCount.filter((requestCount) => {
    const { timestampInSeconds } = requestCount.labels;
    return (
      timestampInSeconds >= startTimeInSeconds &&
      timestampInSeconds <= currentTimeInSeconds
    );
  });

  res.status(200).json({
    status: "success",
    data: {
      numberOfRequests: requestsInDuration.length,
    },
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

module.exports = {
  updateRequestsCounterMiddleware,
  updateProcessTimeMiddleware,
  getNumberOfRequests,
  getAverageProcessTime,
};
