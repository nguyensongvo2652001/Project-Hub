const ProjectMember = require("../models/projectMember");
const User = require("../models/user");
const Project = require("../models/project");
const Notification = require("../models/notification");
const { catchAsync, HandledError } = require("../utils/errorHandling");
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
    memberId: req.user,
  });
  if (!currentLoggedInUserMembership) {
    return next(
      new HandledError(
        `You are not a member of project with id ${projectId}`,
        403
      )
    );
  }

  //Only owner or admin is allowed to invite users.
  currentLoggedInUserMembership.checkRoles("owner", "admin");

  const newMember = await User.findOne({ email });
  if (!newMember) {
    return next(new HandledError(`No users found with email ${email}`, 404));
  }

  const project = await Project.findById(projectId);
  if (!project) {
    return next(
      new HandledError(`No projects found with id ${projectId}`, 404)
    );
  }

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
      detail: project,
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

  // If the current logged in user is not the invited user (according to the membership) then they are not allowed to perform this action
  const isEqualObjectId = membership.memberId.equals(req.user);
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
  const { projectId } = req.params;

  if (!projectId) {
    return next(new HandledError("you must specify the project id", 400));
  }

  const memberships = await ProjectMember.find({
    projectId,
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
  const { projectId } = req.params;
  const q = req.query.q || "";

  const searchQuery = { $regex: q, $options: "i" };

  const allMemberships = await ProjectMember.find({ projectId });
  // We have to call memberId._id because ProjectMember will populate the memberId field after we use find query.
  const allMembersIds = allMemberships.map(
    (membership) => membership.memberId._id
  );

  const memberIdsBasedOnQuery = await User.find({
    _id: { $in: allMembersIds },
    $or: [
      { name: searchQuery },
      { email: searchQuery },
      { jobTitle: searchQuery },
      { description: searchQuery },
    ],
  }).select("_id");

  const query = ProjectMember.find({
    memberId: { $in: memberIdsBasedOnQuery },
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

const editMemberRole = catchAsync(async (req, res, next) => {
  const { membershipId } = req.params;

  const newRole = req.body.role;
  if (!newRole) {
    return next(new HandledError("role can not be empty", 400));
  }

  const newMembership = await ProjectMember.findByIdAndUpdate(
    membershipId,
    { role: newRole },
    { runValidators: true, new: true }
  );

  // If the new role is owner then demote the current owner to admin
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
  editMemberRole,
  searchProjectMembers,
};
