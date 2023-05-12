const express = require("express");
const userController = require("../controllers/user");
const authController = require("../controllers/auth");
const projectController = require("../controllers/project");
const notificationController = require("../controllers/notification");

const router = express.Router();

router.use(authController.checkAuthentication);

router
  .route("/")
  .get(
    userController.prepareGetCurrentUserProfileMiddleware,
    userController.prepareUserSelectMiddleware,
    userController.getUser
  )
  .patch(
    userController.prepareUpdateUserRouteMiddleware,
    userController.prepareUserSelectMiddleware,
    userController.updateUser
  );

router.get(
  "/notification",
  notificationController.prepareGetPersonalNotificationsRoute,
  notificationController.preparePersonalNotificationPopulateOptions,
  notificationController.getAllNotifications
);

router
  .route("/project")
  .get(
    userController.prepareGetAllJoinedProjectsMiddleware,
    projectController.getAllProjects
  );

module.exports = router;
