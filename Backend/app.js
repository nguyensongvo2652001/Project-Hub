const express = require("express");
const cookieParser = require("cookie-parser");
const demoRoute = require("./routes/demo");
const authRoute = require("./routes/auth");
const taskRoute = require("./routes/task");
const projectRoute = require("./routes/project");
const projectMemberRoute = require("./routes/projectMember");
const errorController = require("./controllers/error");
const { HandledError } = require("./utils/errorHandling");

const app = express();

app.use(express.json());
app.use(cookieParser());

const baseApiRoute = process.env.BASE_V1_API_ROUTE || "/api/v1";
console.log(baseApiRoute);
app.use(`${baseApiRoute}/demo`, demoRoute);
app.use(`${baseApiRoute}/project`, projectRoute);
app.use(`${baseApiRoute}/projectMember`, projectMemberRoute);
app.use(`${baseApiRoute}/task`, taskRoute);
app.use(`${baseApiRoute}/auth`, authRoute);
app.use("*", (req, res, next) => {
  next(new HandledError("Route not found", 404));
});
app.use(errorController);

module.exports = app;
