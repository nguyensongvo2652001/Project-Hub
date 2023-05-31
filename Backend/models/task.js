const mongoose = require("mongoose");
const User = require("./user");
const { HandledError } = require("../utils/errorHandling");

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
    required: [true, "A task must belong to a project"],
    validate: {
      validator: async function (v) {
        const project = await mongoose.model("Project").findById(v);
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
  startDate: {
    type: Date,
  },
  deadline: {
    type: Date,
  },
  finishDate: {
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
      validator: function (idList) {
        return idList.length <= 10;
      },
      message:
        "Number of developers for a task must be greater than 0 and less than 10 ",
    },
  },
});

taskSchema.index({ projectId: 1 });
taskSchema.index({ dateCreated: 1 });
taskSchema.index({ finishDate: 1 });
taskSchema.index({ creator: 1 });
taskSchema.index({ name: 1 });
taskSchema.index({ type: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ description: 1 });
taskSchema.index({ developers: 1 });

const validateDevelopers = async (developers, projectId) => {
  await Promise.all(
    developers.map(async (developerId) => {
      const developer = await User.findById(developerId);
      if (!developer) {
        throw new HandledError(`no users found with id = ${developerId}`, 400);
      }

      const membership = await mongoose.model("ProjectMember").findOne({
        projectId,
        memberId: developerId,
      });
      if (!membership) {
        throw new HandledError(
          `user with id = ${developerId} is not a member of project id = ${projectId}`,
          400
        );
      }
    })
  );

  const uniqueIds = {};
  for (const developer of developers) {
    if (developer in uniqueIds) {
      throw new HandledError(
        `you can not add a developer twice (id = ${developer})`,
        400
      );
    }

    uniqueIds[developer] = 1;
  }
};

taskSchema.pre("save", async function (next) {
  if (!this.isNew) return next();

  const membership = await mongoose.model("ProjectMember").findOne({
    projectId: this.projectId,
    memberId: this.creator,
  });
  if (!membership) {
    throw new HandledError("creator must be a member of the project", 403);
  }

  await validateDevelopers(this.developers, this.projectId);

  next();
});

taskSchema.pre(/^find/, function (next) {
  this.populate({
    path: "creator",
    select: "name avatar",
  }).populate({
    path: "developers",
    select: "name avatar",
  });
  next();
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
