const prepareGetPersonalNotificationsRouteMiddleware = (req, res, next) => {
  req.body = {
    scope: "personal",
    receiver: req.user,
  };
  req.query.sort = "-dateCreated";

  next();
};

const preparePersonalNotificationPopulateOptionsMiddleware = (
  req,
  res,
  next
) => {
  const userPopulateOption = "name email jobTitle avatar background";

  req.populateOptions = [
    {
      path: "receiver",
      select: userPopulateOption,
      model: "User", // We have to tell mongoose to look at the User model here because receiver can be an id of multiple models (User, Project, ...) whereas the initiator will always be id of an User
    },
    {
      path: "initiator",
      select: userPopulateOption,
    },
  ];
  next();
};

const prepareGetProjectNotificationsRouteMiddleware = (req, res, next) => {
  req.body = {
    scope: "project",
    receiver: req.params.projectId,
  };
  req.query.sort = "-dateCreated";

  next();
};

const prepareProjectNotificationPopulateOptionsMiddleware = (
  req,
  res,
  next
) => {
  const userPopulateOption = "name email jobTitle avatar background";
  req.populateOptions = [
    {
      path: "initiator",
      select: userPopulateOption,
    },
  ];
  next();
};

module.exports = {
  prepareGetPersonalNotificationsRouteMiddleware,
  preparePersonalNotificationPopulateOptionsMiddleware,
  prepareGetProjectNotificationsRouteMiddleware,
  prepareProjectNotificationPopulateOptionsMiddleware,
};
