const express = require("express");
const projectController = require("../controllers/project");
const authController = require("../controllers/auth");
const router = express.Router();

router
  .route("/")
  .post(
    authController.checkAuthentication,
    projectController.setOwnerId,
    projectController.createProject
  );

module.exports = router;
