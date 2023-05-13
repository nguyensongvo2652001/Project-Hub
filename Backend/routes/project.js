const express = require("express");
const projectController = require("../controllers/project");
const authController = require("../controllers/auth");
const taskController = require("../controllers/task");
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

router.use("/:projectId", projectController.checkUserIsMemberOfProject);
router.get("/:projectId/stat", projectStatController.getProjectStat);

router.get("/:projectId/member", projectMemberController.getAllProjectMembers);
router.get(
  "/:projectId/member/search",
  projectMemberController.searchProjectMembers
);

router.get(
  "/:projectId/notification",
  notificationController.prepareGetProjectNotificationsRoute,
  notificationController.prepareProjectNotificationPopulateOptions,
  notificationController.getAllNotifications
);

router.get("/:projectId/task/search", taskController.searchTasks);

module.exports = router;
