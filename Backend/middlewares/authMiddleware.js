const jwt = require("jsonwebtoken");

const User = require("../models/user");
const { catchAsync, HandledError } = require("../utils/errorHandling");

const validateIfUserLoggedIn = catchAsync(async (req, res, next) => {
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

module.exports = { validateIfUserLoggedIn };
