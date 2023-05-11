const express = require("express");
const projectMemberController = require("../controllers/projectMember");
const authController = require("../controllers/auth");
const router = express.Router();

router.use(authController.checkAuthentication);

router.post("/inviteMember", projectMemberController.inviteMemberToProject);

router.patch(
  "/confirmMembership/:invitationToken",
  projectMemberController.confirmMembership
);

router
  .route("/:id")
  .patch(
    projectMemberController.validateIfUserIsAllowToEditRole,
    projectMemberController.editMemberRole
  );

module.exports = router;
