const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { catchAsync, HandledError } = require("../utils/errorHandling");
const Email = require("../utils/email");

const sendAuthResponse = (res, { user, statusCode, message }) => {
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.cookie("token", token, {
    httpOnly: true,
    maxAge: Number(process.env.JWT_EXPIRES_IN_SECONDS) * 1000,
    secure: true,
    sameSite: "none",
  });

  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    data: {
      message,
      user,
      token,
    },
  });
};

const signUp = catchAsync(async (req, res, next) => {
  // const { email, password } = req.body;

  const newUser = await User.create(req.body);

  const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  sendAuthResponse(res, {
    user: newUser,
    statusCode: 201,
    message: "Create new user successfully",
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new HandledError("Invalid email or password", 400));
  }

  const isCorrectPassword = await user.checkPassword(password);

  if (!isCorrectPassword) {
    return next(new HandledError("Invalid email or password", 400));
  }

  sendAuthResponse(res, {
    user,
    statusCode: 200,
    message: "Login successfully",
  });
});

const logout = (req, res) => {
  res.cookie("token", "", {
    maxAge: 0,
    expires: new Date(0),
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res.status(200).json({
    message: "log out successfully",
  });
};

const validateToken = async (token) => {
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await User.findById(decodedToken.userId);
    if (!user) {
      return false;
    }

    if (user.passwordChangedAfter(decodedToken.iat)) {
      return false;
    }

    return true;
  } catch (err) {
    return false;
  }
};

const validateTokenController = catchAsync(async (req, res, next) => {
  const token = req.cookies.token;
  const tokenIsValid = await validateToken(token);

  res.status(200).json({
    status: "success",
    data: {
      tokenIsValid,
    },
  });
});

const checkAuthentication = catchAsync(async (req, res, next) => {
  let token;
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new HandledError("you are not logged in, please log in first", 401)
    );
  }

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

  const user = await User.findById(decodedToken.userId);
  if (!user) {
    return next(
      new HandledError("the user belonged to this token no longer exists", 401)
    );
  }

  if (user.passwordChangedAfter(decodedToken.iat)) {
    return next(
      new HandledError(
        "the user belonged to this token has changed the password, please log in again",
        401
      )
    );
  }

  req.user = user._id;

  next();
});

const forgotPassword = catchAsync(async (req, res, next) => {
  if (!req.body.email) {
    return next(new HandledError("Email address can not be empty.", 400));
  }

  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new HandledError("There is no user with email address.", 404));
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  try {
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/auth/resetPassword/${resetToken}`;
    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new HandledError(
        "There was an error sending the email. Try again later!",
        500
      )
    );
  }
});

const resetPassword = catchAsync(async (req, res, next) => {
  const { token: encryptedToken } = req.params;
  const token = crypto
    .createHash("sha256")
    .update(encryptedToken)
    .digest("hex");

  const user = await User.findOne({ passwordResetToken: token });
  if (!user) {
    return next(new HandledError("no users found with provided token", 404));
  }

  if (user.passwordResetExpires <= Date.now()) {
    return next(
      new HandledError("the password reset token has already expired", 400)
    );
  }

  const { password } = req.body;
  user.password = password;
  user.passwordChangedAt = new Date();
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  sendAuthResponse(res, {
    user,
    statusCode: 200,
    message: "reset password successfully",
  });
});

module.exports = {
  signUp,
  login,
  logout,
  checkAuthentication,
  forgotPassword,
  resetPassword,
  validateTokenController,
};
