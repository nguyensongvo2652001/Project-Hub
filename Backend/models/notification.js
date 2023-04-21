const mongoose = require("mongoose");
const { HandledError } = require("../utils/errorHandling");

const notificationScopeOptions = ["personal", "project"];

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
  message: {
    type: String,
    trim: true,
    required: [true, "Notification must have a message"],
    maxLength: [
      250,
      "your notication message should not have more than 200 characters",
    ],
  },
  link: {
    type: String,
    trim: true,
  },
  linkMessage: {
    type: String,
    trim: true,
    maxLength: [
      150,
      "your notication link message should not have more than 150 characters",
    ],
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
  receiver: {
    //This field is only necessary in case the scope is personal
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

notificationSchema.pre("save", async function (next) {
  if (this.scope === "personal" && !this.receiver) {
    return next(
      new HandledError("Personal notification must have a receiver", 400)
    );
  }

  next();
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
