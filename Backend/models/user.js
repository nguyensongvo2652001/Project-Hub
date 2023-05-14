const mongoose = require("mongoose");
const validator = require("validator");
const zxcvbn = require("zxcvbn");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    maxLength: [100, "your name can not be longer than 100 characters"],
    trim: true,
  },
  jobTitle: {
    type: String,
    maxLength: [100, "your job title can not be longer than 100 characters"],
    trim: true,
  },
  description: {
    type: String,
    maxLength: [300, "your description can not be longer than 300 characters"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: [true, "An user with this email already existed"],
    lowercase: true,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: "Invalid email address",
    },
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    validate: {
      validator: (password) => {
        const result = zxcvbn(password);
        const passwordStrength = result.score;

        if (passwordStrength >= 3) {
          return true;
        }

        throw new Error(
          `Password is not strong enough: ${result.feedback.suggestions}`
        );
      },
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: String,
  avatar: {
    type: String,
    default:
      "https://projecthubbucket.s3.us-east-005.backblazeb2.com/users/avatar/default_avatar.jpg",
  },
  background: {
    type: String,
    default:
      "https://projectHubBucket.s3.us-east-005.backblazeb2.com/users/background/default_background.jpg",
  },
});

userSchema.index({ passwordResetToken: 1 });

userSchema.statics.hashPasswordResetToken = (token) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  return hashedToken;
};

userSchema.methods.passwordChangedAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

userSchema.methods.checkPassword = async function (password) {
  const isMatch = await bcrypt.compare(password, this.password);
  return isMatch;
};

userSchema.pre("save", async function (next) {
  if (this.name) return next();
  this.name = this.email.split("@")[0];
  next();
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const hashedPassword = await bcrypt.hash(this.password, 10);
  this.password = hashedPassword;
  next();
});

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
