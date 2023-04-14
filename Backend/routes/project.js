const express = require("express");
const projectController = require("../controllers/project");
const authController = require("../controllers/auth");
const taskRouter = require("./task");
const router = express.Router();

router
  .route("/")
  .post(
    authController.checkAuthentication,
    projectController.setOwnerId,
    projectController.createProject
  );

router.use(authController.checkAuthentication);
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

module.exports = router;
