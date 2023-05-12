const Notification = require("../models/notification");
const { getAll } = require("./crud");

const prepareGetPersonalNotificationsRoute = (req, res, next) => {
  req.body = {
    scope: "personal",
    receiver: req.user._id,
  };
  req.query.sort = "-dateCreated";

  next();
};

const preparePersonalNotificationPopulateOptions = (req, res, next) => {
  const userPopulateOption = "name email jobTitle avatar background";
  req.populateOptions = [
    {
      path: "receiver",
      select: userPopulateOption,
      model: "User",
    },
    {
      path: "initiator",
      select: userPopulateOption,
    },
  ];
  next();
};

const getAllNotifications = getAll(Notification);

module.exports = {
  prepareGetPersonalNotificationsRoute,
  preparePersonalNotificationPopulateOptions,
  getAllNotifications,
};
