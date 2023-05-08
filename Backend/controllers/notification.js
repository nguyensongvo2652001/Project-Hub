const Notification = require("../models/notification");
const { getAll } = require("./crud");

const prepareGetPersonalNotificationsRoute = (req, res, next) => {
  req.body.receiver = req.user._id;
  req.query.sort = "-dateCreated";
  req.populateOptions = [
    {
      path: "initiator",
      select: "name email",
    },
  ];
};

const getAllNotifications = getAll(Notification);

module.exports = { prepareGetPersonalNotificationsRoute, getAllNotifications };
