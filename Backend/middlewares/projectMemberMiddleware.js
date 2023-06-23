const ProjectMember = require("../models/projectMember");
const { catchAsync, HandledError } = require("../utils/errorHandling");

const validateIfUserIsAllowToEditRoleMiddleware = catchAsync(
  async (req, res, next) => {
    const { membershipId } = req.params;

    const needToUpdateMembership = await ProjectMember.findOne({
      memberId: membershipId,
      status: "done",
    });
    if (!needToUpdateMembership) {
      return next(
        new HandledError(
          `no membership found with this id = ${membershipId}`,
          404
        )
      );
    }

    // Check if the current logged in user is in the same project with the user in the membership
    const currentUserMembership = await ProjectMember.findOne({
      projectId: needToUpdateMembership.projectId,
      memberId: req.user,
    });
    if (!currentUserMembership) {
      return next(
        new HandledError(`you are not allowed to perform this action`, 403)
      );
    }

    if (needToUpdateMembership.memberId.equals(req.user._id)) {
      return next(new HandledError(`you can not edit your own role`, 400));
    }

    if (currentUserMembership.role !== "owner") {
      return next(
        new HandledError(`you are not allowed to perform this action`, 403)
      );
    }

    req.currentUserMembership = currentUserMembership;
    req.needToUpdateMembership = needToUpdateMembership;

    next();
  }
);

module.exports = { validateIfUserIsAllowToEditRoleMiddleware };
