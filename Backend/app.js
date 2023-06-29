const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const demoRoute = require("./routes/demo");
const authRoute = require("./routes/auth");
const taskRoute = require("./routes/task");
const userRoute = require("./routes/user");
const projectRoute = require("./routes/project");
const monitorRoute = require("./routes/monitor");
const projectMemberRoute = require("./routes/projectMember");
const currentUserRoute = require("./routes/currentUser");
const errorController = require("./controllers/error");
const monitorController = require("./controllers/monitor");
const { HandledError } = require("./utils/errorHandling");

const app = express();

app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: "https://project-hub.onrender.com/",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204,
  credentials: true,
};
app.use(cors(corsOptions));

const baseApiRoute = process.env.BASE_V1_API_ROUTE || "/api/v1";

app.use(monitorController.updateRequestsCounterMiddleware);
app.use(monitorController.updateProcessTimeMiddleware);
app.use(`${baseApiRoute}/demo`, demoRoute);
app.use(`${baseApiRoute}/project`, projectRoute);
app.use(`${baseApiRoute}/projectMember`, projectMemberRoute);
app.use(`${baseApiRoute}/task`, taskRoute);
app.use(`${baseApiRoute}/user`, userRoute);
app.use(`${baseApiRoute}/me`, currentUserRoute);
app.use(`${baseApiRoute}/auth`, authRoute);
app.use(`${baseApiRoute}/monitor`, monitorRoute);
app.use("*", (req, res, next) => {
  next(new HandledError(`Route ${req.url} not found`, 404));
});
app.use(errorController);

module.exports = app;
