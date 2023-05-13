const mongoose = require("mongoose");
const crypto = require("crypto");
const { HandledError } = require("../utils/errorHandling");
const Task = require("./task");
const userStatController = require("../controllers/userStat");

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
      enum: ["owner", "admin", "developer"],
      default: "developer",
      validate: {
        validator: function (v) {
          return ["owner", "admin", "developer"].includes(v);
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

projectMemberSchema.virtual("performance").get(function () {
  return this._performance;
});

projectMemberSchema.virtual("performance").set(function (value) {
  this._performance = value;
});

projectMemberSchema.index({ projectId: 1 });
projectMemberSchema.index({ memberId: 1 });
projectMemberSchema.index({ role: 1 });
projectMemberSchema.index({ invitationToken: 1 });
projectMemberSchema.index({ status: 1 });

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
