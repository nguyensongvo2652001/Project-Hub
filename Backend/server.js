const dotenv = require("dotenv");
dotenv.config({ path: "./env/main.env" });

const { connectDB } = require("./utils/db");
const taskController = require("./controllers/task");
const monitorController = require("./controllers/monitor");

process.on("uncaughtException", (err) => {
  console.error(err, "Uncaught Exception Caught");
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error(err);
  process.exit(1);
});

const { getRedisClient } = require("./utils/redisClient");

let uri = process.env.DB_STRING;
uri = uri.replace(/<password>/, process.env.DB_PASSWORD);
uri = uri.replace(/<databaseName>/, process.env.DB_NAME);

(async () => {
  await connectDB(uri);
  redisClient = getRedisClient();
  await redisClient.connect();
  taskController.updateTaskStatusCron();
  monitorController.resetPrometheusMetricsCronJob();
})();

const app = require("./app");

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log("SERVER STARTED");
});

module.exports = server;
