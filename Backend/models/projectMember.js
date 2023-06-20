const mongoose = require("mongoose");
const crypto = require("crypto");
const { HandledError } = require("../utils/errorHandling");

const possibleProjectMembersRole = ["owner", "admin", "developer", "pending"];

const projectMemberSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      validate: {
        validator: async function (v) {
          const project = await mongoose.model("Project").findById(v);
          return project !== null;
        },
        message: (props) => `Project with id ${props.value} does not exist`,
      },
    },
    dateJoined: {
      type: Date,
      default: Date.now,
    },
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      validate: {
        validator: async function (v) {
          const user = await mongoose.model("User").findById(v);
          return user !== null;
        },
        message: (props) => `User with id ${props.value} does not exist`,
      },
    },
    role: {
      type: String,
      enum: possibleProjectMembersRole,
      default: "developer",
      validate: {
        validator: function (v) {
          return possibleProjectMembersRole.includes(v);
        },
        message: (props) =>
          `${
            props.value
          } is not a valid role. Role must be one of ${props.enumValues.join(
            ", "
          )}.`,
      },
    },
    status: {
      type: String,
      enum: ["pending", "done"],
      default: "done",
      validate: {
        validator: function (v) {
          return ["pending", "done"].includes(v);
        },
        message: (props) =>
          `${
            props.value
          } is not a valid status. Status must be one of ${props.enumValues.join(
            ", "
          )}.`,
      },
    },
    invitationToken: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

projectMemberSchema.index({ projectId: 1 });
projectMemberSchema.index({ memberId: 1 });
projectMemberSchema.index({ role: 1 });
projectMemberSchema.index({ invitationToken: 1 });
projectMemberSchema.index({ status: 1 });

projectMemberSchema.pre(/^find/, function (next) {
  if (this.skipPopulate) {
    return next();
  }

  this.populate({
    path: "memberId",
    select: "name email avatar jobTitle",
  });
  next();
});

//We will need this field when we want provide information about whether a member is responsible for certain tasks for or not.
projectMemberSchema.virtual("isTaskDeveloper").get(function () {
  return this._isTaskDeveloper;
});

projectMemberSchema.virtual("isTaskDeveloper").set(function (value) {
  this._isTaskDeveloper = value;
});

projectMemberSchema.virtual("performance").get(function () {
  return this._performance;
});

projectMemberSchema.virtual("performance").set(function (value) {
  this._performance = value;
});

projectMemberSchema.methods.createInvitationToken = function () {
  const token = crypto.randomBytes(32).toString("hex");
  this.invitationToken = token;
  return token;
};

projectMemberSchema.methods.checkRoles = function (...acceptedRoles) {
  if (!acceptedRoles.includes(this.role)) {
    throw new HandledError(
      `Only ${acceptedRoles.join(", ")} are allowed to perform this action`,
      403
    );
  }

  return true;
};

const ProjectMember = mongoose.model("ProjectMember", projectMemberSchema);

module.exports = ProjectMember;
