const express = require("express");
const authController = require("../controllers/auth");

const router = express.Router();

router.post("/signUp", authController.signUp);
router.get("/logout", authController.logout);
router.post("/login", authController.login);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);
router.post("/validateToken", authController.validateTokenController);

module.exports = router;
