const express = require("express");
const userController = require("../controllers/user");
const authController = require("../controllers/auth");

const router = express.Router();

router.use(authController.checkAuthentication);

router
  .route("/:id")
  .get(userController.prepareUserSelectMiddleware, userController.getUser);

module.exports = router;
