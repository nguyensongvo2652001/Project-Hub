const express = require("express");
const taskController = require("../controllers/task");
const authController = require("../controllers/auth");
const router = express.Router();

router
  .route("/")
  .post(authController.checkAuthentication, taskController.createTask);

module.exports = router;
