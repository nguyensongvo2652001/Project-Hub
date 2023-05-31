const express = require("express");

const userController = require("../controllers/user");

const authMiddleware = require("../middlewares/authMiddleware");
const userMiddleware = require("../middlewares/userMiddleware");

const router = express.Router();

router.use(authMiddleware.validateIfUserLoggedIn);

router.get("/search", userController.searchUsers);

router
  .route("/:id")
  .get(
    userMiddleware.prepareUserSelectOptionsMiddleware,
    userController.getUser
  );

module.exports = router;
