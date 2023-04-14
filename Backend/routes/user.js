const express = require("express");
const userController = require("../controllers/user");
const authController = require("../controllers/auth");

const router = express.Router();

router
  .route("/:id")
  .get(authController.checkAuthentication, userController.getUser);

module.exports = router;
