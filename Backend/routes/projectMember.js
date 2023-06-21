const express = require("express");

const projectMemberController = require("../controllers/projectMember");
const authController = require("../controllers/auth");

const authMiddleware = require("../middlewares/authMiddleware");
const projectMiddleware = require("../middlewares/projectMiddleware");
const projectMemberMiddleware = require("../middlewares/projectMemberMiddleware");

const router = express.Router();

router.use(authMiddleware.validateIfUserLoggedIn);

router.post("/inviteMember", projectMemberController.inviteMemberToProject);

router.patch(
  "/confirmMembership/:invitationToken",
  projectMemberController.confirmMembership
);

router
  .route("/:membershipId")
  .patch(
    projectMemberMiddleware.validateIfUserIsAllowToEditRoleMiddleware,
    projectMemberController.editMemberRole
  )
  .delete(projectMemberController.deleteProjectMember);

module.exports = router;
