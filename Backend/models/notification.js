const mongoose = require("mongoose");
const { HandledError } = require("../utils/errorHandling");

const notificationScopeOptions = ["personal", "project"];

const notificationTypeOptions = [
  "project_invitation",
  "project_invitation_confirm",
  "project_new_task",
  "project_update_task",
  "project_delete_task",
  "project_update",
  "project_delete_member",
  "project_member_left",
];

const notificationSchema = new mongoose.Schema({
  initiator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Notification must have an initiator"],
    validate: {
      validator: async function (v) {
        const user = await mongoose.model("User").findById(v);
        return user !== null;
      },
      message: (props) => `User with this id (${props.value}) does not exist`,
    },
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  scope: {
    type: String,
    enum: notificationScopeOptions,
    validate: {
      validator: function (v) {
        return notificationScopeOptions.includes(v);
      },
      message: (props) =>
        `${
          props.value
        } is not a valid scope. Scope must be one of ${notificationScopeOptions.join(
          ", "
        )}.`,
    },
  },
  //Note that this field can be User (if the scope is personal) or Project (if the scope is project)
  receiver: {
    required: [true, "Notifications must have receiver"],
    type: mongoose.Schema.Types.ObjectId,
  },
  type: {
    type: String,
    enum: notificationTypeOptions,
    validate: {
      validator: function (v) {
        return notificationTypeOptions.includes(v);
      },
      message: (props) =>
        `${
          props.value
        } is not a valid type. Type must be one of ${notificationTypeOptions.join(
          ", "
        )}.`,
    },
  },
  detail: {
    type: mongoose.Schema.Types.Mixed,
  },
});

notificationSchema.index({ type: 1 });
notificationSchema.index({ scope: 1 });
notificationSchema.index({ receiver: 1 });

notificationSchema.pre("save", async function (next) {
  const id = this.receiver;

  if (this.scope === "personal") {
    const user = await mongoose.model("User").findById(id);
    if (!user) {
      return next(
        new HandledError(`There are no users with provided id = ${id}`, 404)
      );
    }
  } else {
    const project = await mongoose.model("Project").findById(id);
    if (!project) {
      return next(
        new HandledError(`There are no projects with provided id = ${id}`, 404)
      );
    }
  }

  next();
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
