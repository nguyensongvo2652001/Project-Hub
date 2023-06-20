const mongoose = require("mongoose");
const ProjectMember = require("./projectMember");

const projectTags = [
  "Website",
  "Mobile",
  "Software",
  "AI",
  "CloudComputing",
  "Security",
  "Other",
  "Data",
];

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Project must have a name"],
      maxLength: [250, "Project name should have at most 250 characters"],
      trim: true,
      validate: {
        validator: function (v) {
          return /^[a-zA-Z0-9_ ]*$/.test(v); // Name should only contain letters, numbers, underscores, and spaces
        },
        message:
          "Project name can only contain letters, numbers, underscores, and spaces",
      },
    },
    tag: {
      type: String,
      validate: {
        validator: function (v) {
          return projectTags.includes(v);
        },
        message: (props) =>
          `${
            props.value
          } is not a valid tag. Tag must be either: ${projectTags.join(", ")}.`,
      },
      enum: projectTags,
    },
    dateCreated: {
      type: Date,
      default: Date.now,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Project must have an owner"],
      validate: {
        validator: async function (v) {
          const user = await mongoose.model("User").findById(v);
          return user !== null;
        },
        message: (props) => `User with this id (${props.value}) does not exist`,
      },
    },
    status: {
      type: String,
      enum: ["private", "public"],
      default: "public",
      validate: {
        validator: function (v) {
          return ["private", "public"].includes(v);
        },
        message: (props) =>
          `${
            props.value
          } is not a valid status. Status must be one of ${props.enumValues.join(
            ", "
          )}.`,
      },
    },
    description: {
      type: String,
      trim: true,
      maxLength: [
        500,
        "your description should not be longer than 500 characters",
      ],
    },
    lastChanged: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

projectSchema.index({ owner: 1 });
projectSchema.index({ name: 1 });
projectSchema.index({ status: 1 });

projectSchema
  .virtual("skipCreatingOwnerMembership")
  .get(function () {
    return this._skipCreatingOwnerMembership;
  })
  .set(function (value) {
    this._skipCreatingOwnerMembership = value;
  });

projectSchema.post("save", async function (doc, next) {
  if (!this.isNew) return next();

  try {
    await mongoose.model("ProjectMember").create({
      projectId: doc._id,
      memberId: doc.owner,
      role: "owner",
    });

    next();
  } catch (err) {
    next(err);
  }
});

projectSchema.virtual("numberOfMembers", {
  ref: "ProjectMember",
  localField: "_id",
  foreignField: "projectId",
  match: { status: "done" },
  count: true,
});

projectSchema.virtual("tasksCount").get(function () {
  return this._tasksCount;
});

projectSchema.virtual("tasksCount").set(function (value) {
  this._tasksCount = value;
});

projectSchema.virtual("membersCount").get(function () {
  return this._membersCount;
});

projectSchema.virtual("membersCount").set(function (value) {
  this._membersCount = value;
});

projectSchema.methods.countTasksByType = async function () {
  //Task will have a projectId field to identify which project that task belongs to so we use that to find all the tasks that belonged to the current projects and count the number of tasks for each types.
  const result = await mongoose.model("Task").aggregate([
    {
      $lookup: {
        from: "projects",
        localField: "projectId",
        foreignField: "_id",
        as: "project",
      },
    },
    { $unwind: "$project" },
    { $match: { "project._id": this._id } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);
  return result;
};

projectSchema.methods.countMembersByRole = async function () {
  const result = await mongoose.model("ProjectMember").aggregate([
    { $match: { status: "done" } },
    {
      $lookup: {
        from: "projects",
        localField: "projectId",
        foreignField: "_id",
        as: "project",
      },
    },
    { $unwind: "$project" },
    { $match: { "project._id": this._id } },
    { $group: { _id: "$role", count: { $sum: 1 } } },
  ]);

  return result;
};

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
