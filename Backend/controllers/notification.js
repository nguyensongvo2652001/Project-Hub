const Notification = require("../models/notification");
const { getAll } = require("./crud");

const prepareGetPersonalNotificationsRoute = (req, res, next) => {
  req.body.receiver = req.user._id;
  req.query.sort = "-dateCreated";
};

const getAllNotifications = getAll(Notification);
