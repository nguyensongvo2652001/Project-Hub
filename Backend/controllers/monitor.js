const promClient = require("prom-client");
const { catchAsync, HandledError } = require("../utils/errorHandling");
const { promisify } = require("util");

promClient.collectDefaultMetrics();

const APP_REQUESTS_TOTAL = "app_requests_total";

// Define a Prometheus counter to track the number of requests
const requestsCounter = new promClient.Counter({
  name: APP_REQUESTS_TOTAL,
  help: "Total number of requests made to the app",
  labelNames: ["timestampInSeconds"],
});

const updateRequestsCounterMiddleware = (req, res, next) => {
  const timestampInSeconds = Math.floor(Date.now() / 1000);

  requestsCounter.inc({ timestampInSeconds });

  requestsCounter.inc();
  next();
};

const getNumberOfRequests = catchAsync(async (req, res, next) => {
  const durationInMinutes = req.query.duration || 10;
  const metrics = await promClient.register
    .getSingleMetric("app_requests_total")
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

module.exports = { updateRequestsCounterMiddleware, getNumberOfRequests };
