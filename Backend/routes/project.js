const express = require("express");
const projectController = require("../controllers/project");
const authController = require("../controllers/auth");
const taskRouter = require("./task");
const projectMemberController = require("../controllers/projectMember");
const projectStatController = require("../controllers/projectStat");
const notificationController = require("../controllers/notification");
const router = express.Router();

router.use(authController.checkAuthentication);
router.get("/search", projectController.searchProjects);
router
  .route("/")
  .get(
    projectController.filterOnlyPublicProjectsMiddleware,
    projectController.sortProjectsByDateCreatedMiddleware,
    projectController.getAllProjects
  )
  .post(projectController.setOwnerId, projectController.createProject);

router
  .route("/:id")
  .get(projectController.getProject)
  .patch(
    projectController.checkUserIsOwner,
    projectController.filterProjectData,
    projectController.prepareUpdateProjectMiddleware,
    projectController.updateProject
  );

router.get(
  "/:projectId/stat",
  projectController.checkUserIsMemberOfProject,
  projectStatController.getProjectStat
);

router.get(
  "/:projectId/member",
  projectController.checkUserIsMemberOfProject,
  projectMemberController.getAllProjectMembers
);

router.get(
  "/:projectId/notification",
  projectController.checkUserIsMemberOfProject,
  notificationController.prepareGetProjectNotificationsRoute,
  notificationController.prepareProjectNotificationPopulateOptions,
  notificationController.getAllNotifications
);

module.exports = router;
