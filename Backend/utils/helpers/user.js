const User = require("../../models/user");
const { HandledError } = require("../errorHandling");

const findUserByEmail = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new HandledError(`No users found with email ${email}`, 404);
  }

  return user;
};

module.exports = { findUserByEmail };
