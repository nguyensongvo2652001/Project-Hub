const express = require("express");
const projectController = require("../controllers/project");
const authController = require("../controllers/auth");
const taskRouter = require("./task");
const projectMemberController = require("../controllers/projectMember");
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
  .get()
  .get(projectController.getProject)
  .patch(
    projectController.checkUserIsOwner,
    projectController.filterProjectData,
    projectController.updateProject
  );

router.use(
  "/:projectId/task",
  projectController.checkUserIsMemberOfProject,
  taskRouter
);

router.get(
  "/:projectId/member",
  projectController.checkUserIsMemberOfProject,
  projectMemberController.getAllProjectMembers
);

module.exports = router;
