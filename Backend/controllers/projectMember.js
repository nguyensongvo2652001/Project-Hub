const ProjectMember = require("../models/projectMember");
const User = require("../models/user");
const Project = require("../models/project");
const Notification = require("../models/notification");
const { catchAsync, HandledError } = require("../utils/errorHandling");
const { findUserByEmail } = require("../utils/helpers/user");
const { findDocumentById } = require("../utils/helpers/general");
const userStatController = require("./userStat");
const APIFeatures = require("../utils/apiFeatures");
const Email = require("../utils/email");

const inviteMemberToProject = catchAsync(async (req, res, next) => {
  const { email, projectId } = req.body;

  if (!email || !projectId) {
    return next(
      new HandledError(`New member email or project id is missing`, 400)
    );
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

  const newMember = await findUserByEmail(email);

  const project = await findDocumentById(Project, projectId);

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

    await Notification.create({
      initiator: req.user._id,
      type: process.env.NOTIFICATION_PROJECT_INVITATION_TYPE,
      scope: "personal",
      receiver: newMember._id,
    });
  }

  const token = newMemberMembership.createInvitationToken();
  await newMemberMembership.save();

  const link = `${process.env.BASE_V1_API_ROUTE}/confirmMembership/${token}`;

  const emailSender = new Email(newMember, link);
  emailSender.projectName = project.name;
  await emailSender.sendProjectInvitation();

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
    membership.performance =
      await userStatController.getPerformanceInOneProject(
        membership.memberId._id,
        membership.projectId
      );
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

const searchProjectMembers = catchAsync(async (req, res, next) => {
  let { q } = req.query;

  if (!q) {
    q = "";
  }

  const searchQuery = { $regex: q, $options: "i" };

  const possibleUsers = await User.find({
    $or: [
      { name: searchQuery },
      { email: searchQuery },
      { jobTitle: searchQuery },
      { description: searchQuery },
    ],
  }).select("_id");
  const possibleMemberIds = possibleUsers.map((user) => user._id);

  const { projectId } = req.params;
  const query = ProjectMember.find({
    memberId: { $in: possibleMemberIds },
    projectId,
  });

  const queryString = req.query;
  if (!queryString.sort) {
    queryString.sort = "-dateJoined";
  }

  const features = new APIFeatures(query, queryString)
    .sort()
    .limitFields()
    .paginate();

  const members = await features.query;

  res.status(200).json({
    status: "success",
    data: {
      length: members.length,
      members,
    },
  });
});

const validateIfUserIsAllowToEditRole = catchAsync(async (req, res, next) => {
  const updateMembershipId = req.params.id;
  const needToUpdateMembership = await ProjectMember.findById(
    updateMembershipId
  );
  const currentUserMembership = await ProjectMember.findOne({
    projectId: needToUpdateMembership.projectId,
    memberId: req.user._id,
  });

  if (!needToUpdateMembership) {
    return next(
      new HandledError(
        `no membership found with this id = ${updateMembershipId}`,
        404
      )
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
});

const editMemberRole = catchAsync(async (req, res, next) => {
  const newRole = req.body.role;
  if (!newRole) {
    return next(new HandledError("role can not be empty", 400));
  }

  const newMembership = await ProjectMember.findByIdAndUpdate(
    req.params.id,
    { role: newRole },
    { runValidators: true, new: true }
  );
  if (newRole === "owner") {
    req.currentUserMembership.role = "admin";
    await req.currentUserMembership.save();
  }

  res.status(200).json({
    status: "success",
    data: {
      membership: newMembership,
    },
  });
});

module.exports = {
  inviteMemberToProject,
  confirmMembership,
  getAllProjectMembers,
  validateIfUserIsAllowToEditRole,
  editMemberRole,
  searchProjectMembers,
};
