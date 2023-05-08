const ProjectMember = require("../models/projectMember");
const User = require("../models/user");
const Project = require("../models/project");
const Notification = require("../models/notification");
const { catchAsync, HandledError } = require("../utils/errorHandling");
const { findUserByEmail } = require("../utils/helpers/user");
const { findDocumentById } = require("../utils/helpers/general");

async function sendEmail(email, link) {
  console.log(`Send email to ${email} with the link: ${link}`);
}

const inviteMemberToProject = catchAsync(async (req, res, next) => {
  const { email, projectId } = req.body;

  if (!email || !projectId) {
    return next(
      new HandledError(`New member email or project id is missing`, 400)
    );
  }

  const newMember = await findUserByEmail(email);

  await findDocumentById(Project, projectId);

  let newMemberMembership = await ProjectMember.findOne({
    projectId,
    memberId: newMember._id,
  });
  if (newMemberMembership && newMemberMembership.status !== "pending") {
    return next(
      new HandledError(
        `User with email = ${email} is already in project id = ${projectId}`,
        400
      )
    );
  }

  if (!newMemberMembership) {
    newMemberMembership = await ProjectMember.create({
      memberId: newMember._id,
      projectId,
      status: "pending",
    });
  }

  const currentLoggedInUserMembership = await ProjectMember.findOne({
    projectId,
    memberId: req.user._id,
  });
  if (!currentLoggedInUserMembership) {
    return next(
      new HandledError(
        `You are not a member of project with id ${projectId}`,
        403
      )
    );
  }

  currentLoggedInUserMembership.checkRoles("owner", "admin");

  const token = newMemberMembership.createInvitationToken();
  await newMemberMembership.save();

  const link = `${process.env.BASE_V1_API_ROUTE}/confirmMembership/${token}`;
  await sendEmail(email, link);

  await Notification.create({
    initiator: req.user._id,
    type: process.env.NOTIFICATION_PROJECT_INVITATION_TYPE,
    scope: "personal",
    receiver: newMember._id,
  });

  res.status(200).json({
    message: `An invitation letter has been sent to ${email}`,
  });
});

const confirmMembership = catchAsync(async (req, res, next) => {
  const { invitationToken } = req.params;

  const membership = await ProjectMember.findOneAndUpdate(
    {
      invitationToken,
    },
    { status: "done" },
    { new: true }
  );

  if (!membership) {
    return next(
      new HandledError(
        "Can not find any members with that invitation token",
        404
      )
    );
  }

  const isEqualObjectId = membership.memberId.equals(req.user._id);
  if (!isEqualObjectId) {
    return next(
      new HandledError("You are not allowed to perform this action", 403)
    );
  }

  membership.invitationToken = undefined;
  await membership.save();

  await Notification.create({
    initiator: req.user._id,
    type: process.env.NOTIFICATION_PROJECT_INVITATION_CONFIRM_TYPE,
    scope: "project",
    receiver: membership.projectId,
  });

  res.status(200).json({
    status: "success",
    data: {
      membership,
      message: "Invite member to project successfully",
    },
  });
});

const getAllProjectMembers = catchAsync(async (req, res, next) => {
  if (!req.params.projectId) {
    return next(new HandledError("you must specify the project id", 400));
  }

  const memberships = await ProjectMember.find({
    projectId: req.params.projectId,
  }).populate({
    path: "memberId",
    select: "name email",
  });

  const promises = memberships.map(async (membership) => {
    const performance = await membership.getMemberPerformance(
      membership.memberId._id,
      membership.projectId
    );
    membership.performance = performance;
  });

  await Promise.all(promises);

  res.status(200).json({
    status: "success",
    data: {
      length: memberships.length,
      members: memberships,
    },
  });
});

module.exports = {
  inviteMemberToProject,
  confirmMembership,
  getAllProjectMembers,
};
