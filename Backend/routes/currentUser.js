const express = require("express");
const userController = require("../controllers/user");
const authController = require("../controllers/auth");
const projectController = require("../controllers/project");

const router = express.Router();

router.use(authController.checkAuthentication);

router
  .route("/project")
  .get(
    userController.prepareGetAllJoinedProjectsMiddleware,
    projectController.getAllProjects
  );

module.exports = router;
