const mongoose = require("mongoose");
const ProjectMember = require("./projectMember");

const projectTags = ["Website", "Mobile", "Software", "Other"];

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

projectSchema.post("save", async function (doc, next) {
  try {
    await ProjectMember.create({
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

projectSchema.index({ owner: 1 });
projectSchema.index({ name: 1 });
projectSchema.index({ status: 1 });

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
