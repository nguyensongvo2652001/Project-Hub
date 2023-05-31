const mongoose = require("mongoose");
const util = require("util");
const { HandledError } = require("../utils/errorHandling");

const handleValidationError = (err) => {
  const errorFields = Object.keys(err.errors);
  let cleanedErrorMessage = [];
  for (const field of errorFields) {
    cleanedErrorMessage.push(err.errors[field].message);
  }
  cleanedErrorMessage = cleanedErrorMessage.join("; ");
  return new HandledError(cleanedErrorMessage, 400);
};

const handleDuplicationError = (err) => {
  const duplicatedFields = Object.keys(err["keyPattern"]);
  let cleanedErrorMessage = [];
  for (const field of duplicatedFields) {
    cleanedErrorMessage.push(`${field} must be unique`);
  }
  cleanedErrorMessage = cleanedErrorMessage.join("; ");
  return new HandledError(cleanedErrorMessage, 409);
};

const handleCastError = (err) => {
  const { kind, value } = err;
  const message = `${value} is not a valid ${kind}`;
  return new HandledError(message, 400);
};

const handleSyntaxError = (err) => {
  return new HandledError("invalid syntax in request body", 400);
};

const handleTokenExpiredError = (err) => {
  return new HandledError("your token has expired, please log in again", 401);
};

const handleJsonWebTokenError = (err) => {
  return new HandledError(
    "your token is not valid, please try log in again",
    401
  );
};

const handleMulterError = (err) => {
  return new HandledError(
    "something went wrong uploading your files, please check your files again",
    400
  );
};

const errorController = (err, req, res, next) => {
  console.log(err);

  if (process.env.NODE_ENV === "DEBUG") {
    console.error(err.stack);
    console.log(err.name);
    console.log(util.inspect(err, { showHidden: true }));
  }

  if (err instanceof mongoose.Error.ValidationError) {
    err = handleValidationError(err);
  }

  if (err.name === "MongoServerError" && err.code === 11000) {
    err = handleDuplicationError(err);
  }

  if (err.name === "CastError") {
    err = handleCastError(err);
  }

  if (err.name === "SyntaxError") {
    err = handleSyntaxError(err);
  }

  if (err.name === "TokenExpiredError") {
    err = handleTokenExpiredError(err);
  }

  if (err.name === "JsonWebTokenError") {
    err = handleJsonWebTokenError(err);
  }

  if (err.name === "MulterError") {
    err = handleMulterError(err);
  }

  if (!err.isOperational) {
    err.statusCode = 500;
    err.status = "fail";
    err.message = "Server error";
  }

  res.status(err.statusCode).json({ message: err.message, status: err.status });
};

module.exports = errorController;
