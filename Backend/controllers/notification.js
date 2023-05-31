const Notification = require("../models/notification");
const { getAll } = require("./crud");

const getAllNotifications = getAll(Notification);

module.exports = {
  getAllNotifications,
};
