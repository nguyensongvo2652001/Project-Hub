const express = require("express");

const projectController = require("../controllers/project");
const taskController = require("../controllers/task");
const projectMemberController = require("../controllers/projectMember");
const projectStatController = require("../controllers/projectStat");
const notificationController = require("../controllers/notification");

const authMiddleware = require("../middlewares/authMiddleware");
const notificationMiddleware = require("../middlewares/notificationMiddleware");
const projectMiddelware = require("../middlewares/projectMiddleware");
const taskMiddleware = require("../middlewares/taskMiddleware");

const router = express.Router();

router.use(authMiddleware.validateIfUserLoggedIn);

router.get("/search", projectController.searchProjects);
router
  .route("/")
  .get(
    projectMiddelware.filterOnlyPublicProjectsMiddleware,
    projectMiddelware.sortProjectsByDateCreatedMiddleware,
    projectController.getAllProjects
  )
  .post(
    projectMiddelware.setProjectOwnerFieldBeforeCreateProjectMiddleware,
    projectController.createProject
  );

router
  .route("/:projectId")
  .all(projectMiddelware.validateIfUserIsMemberOfProjectMiddleware)
  .get(projectController.getProject)
  .patch(
    projectMiddelware.validateIfUserIsOwnerOfTheProjectMiddleware,
    projectMiddelware.filterProjectDataMiddleware,
    projectMiddelware.prepareUpdateProjectMiddleware,
    projectController.updateProject
  );

router.get(
  "/:projectId/publicDetail",
  projectController.getProjectPublicDetail
);
router.use(
  "/:projectId",
  projectMiddelware.validateIfUserIsMemberOfProjectMiddleware
);
router.get("/:projectId/stat", projectStatController.getProjectStat);

router.get("/:projectId/member", projectMemberController.getAllProjectMembers);
router.get(
  "/:projectId/member/search",
  projectMemberController.searchProjectMembers
);
router.get(
  "/:projectId/nonMember/search",
  projectMemberController.searchNonProjectMembers
);

router.get(
  "/:projectId/notification",
  notificationMiddleware.prepareGetProjectNotificationsRouteMiddleware,
  notificationMiddleware.prepareProjectNotificationPopulateOptionsMiddleware,
  notificationController.getAllNotifications
);

router.get(
  "/:projectId/task/",
  taskMiddleware.prepareGetAllTasksMiddleware,
  taskController.getAllTasks
);
router.get("/:projectId/task/search", taskController.searchTasks);

module.exports = router;
