const express = require("express");

const userController = require("../controllers/user");
const notificationController = require("../controllers/notification");
const userStatController = require("../controllers/userStat");

const authMiddleware = require("../middlewares/authMiddleware");
const notificationMiddleware = require("../middlewares/notificationMiddleware");
const userMiddleware = require("../middlewares/userMiddleware");

const router = express.Router();

router.use(authMiddleware.validateIfUserLoggedIn);

router
  .route("/")
  .get(
    userMiddleware.prepareGetCurrentUserProfileMiddleware,
    userMiddleware.prepareUserSelectOptionsMiddleware,
    userController.getUser
  )
  .patch(
    userMiddleware.prepareUpdateUserRouteMiddleware,
    userMiddleware.getImageDataMiddleware,
    userMiddleware.prepareUserSelectOptionsMiddleware,
    userMiddleware.uploadAvatarMiddleware,
    userMiddleware.uploadBackgroundMiddleware,
    userController.updateUser
  );

router.get(
  "/notification",
  notificationMiddleware.prepareGetPersonalNotificationsRouteMiddleware,
  notificationMiddleware.preparePersonalNotificationPopulateOptionsMiddleware,
  notificationController.getAllNotifications
);

router.route("/project").get(userController.getAllJoinedProjects);

router.get("/stat", userStatController.getPersonalStat);
module.exports = router;
