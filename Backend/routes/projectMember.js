const express = require("express");
const projectMemberController = require("../controllers/projectMember");
const authController = require("../controllers/auth");
const router = express.Router();

router.post(
  "/inviteMember",
  authController.checkAuthentication,
  projectMemberController.inviteMemberToProject
);

router.patch(
  "/confirmMembership/:invitationToken",
  authController.checkAuthentication,
  projectMemberController.confirmMembership
);

module.exports = router;
