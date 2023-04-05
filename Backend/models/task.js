const mongoose = require("mongoose");
const Project = require("./project");
const User = require("./user");
const { HandledError } = require("../utils/errorHandling");
const ProjectMember = require("./projectMember");

const taskTypeOptions = [
  "feature",
  "bug",
  "test",
  "refactor",
  "document",
  "maintenance",
  "design",
];

const taskStatusOptions = ["open", "doing", "testing", "overdue", "closed"];

const taskSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: [true, "a task must belong to a project"],
    validate: {
      validator: async function (v) {
        const project = await Project.findById(v);
        return project !== null;
      },
      message: (props) => `Project with id ${props.value} does not exist`,
    },
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "a task must have a creator"],
    validate: {
      validator: async function (v) {
        const user = await User.findById(v);
        return user !== null;
      },
      message: (props) => `User with id ${props.value} does not exist`,
    },
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  lastChange: {
    type: Date,
    default: Date.now,
  },
  startDate: {
    type: Date,
  },
  deadline: {
    type: Date,
  },
  name: {
    type: String,
    trim: true,
    required: [true, "A task must have a name"],
    maxLength: [100, "Task name should not be more than 100 characters"],
  },
  type: {
    type: String,
    enum: taskTypeOptions,
    validate: {
      validator: function (v) {
        return taskTypeOptions.includes(v);
      },
      message: (props) => `${props.value} is not a valid task type`,
    },
    required: [true, "Task must have a type"],
  },
  status: {
    type: String,
    enum: taskStatusOptions,
    validate: {
      validator: function (v) {
        return taskStatusOptions.includes(v);
      },
      message: (props) => `${props.value} is not a valid task status`,
    },
    default: "open",
  },
  description: {
    type: String,
    trim: true,
    maxLength: [250, "Task description should not be more than 250 characters"],
  },
  developers: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    validate: {
      validator: {
        validator: function (idList) {
          return idList.length > 0;
        },
        message: "There must be at least one developer for this task",
      },
    },
  },
});

taskSchema.index({ projectId: 1 });
taskSchema.index({ name: 1 });
taskSchema.index({ type: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ description: 1 });

taskSchema.pre("save", async function (next) {
  const membership = await ProjectMember.findOne({
    projectId: this.projectId,
    memberId: this.creator,
  });
  if (!membership) {
    throw new HandledError("creator must be a member of the project", 403);
  }

  await Promise.all(
    this.developers.map(async (developerId) => {
      const developer = await User.findById(developerId);
      if (!developer) {
        throw new HandledError(`no users found with id = ${developerId}`, 404);
      }

      const membership = await ProjectMember.findOne({
        projectId: this.projectId,
        memberId: developerId,
      });
      if (!membership) {
        throw new HandledError(
          `user with id = ${developerId} is not a member of project id = ${this.projectId}`,
          400
        );
      }
    })
  );

  next();
});

const Task = mongoose.Model(taskSchema, "Task");

module.exports = Task;
