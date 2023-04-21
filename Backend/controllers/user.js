const User = require("../models/user");
const ProjectMember = require("../models/projectMember");
const CRUDOptions = require("../utils/crudOptions");
const { catchAsync } = require("../utils/errorHandling");
const { getOne, updateOne } = require("./crud");

const allowedVisibleFieldsForUsers = "name jobTitle description email";
const allowedUpdateFieldsForUsers = ["name", "jobTitle", "description"];

const getUserCrudOptions = new CRUDOptions();
getUserCrudOptions.selectOptions = allowedVisibleFieldsForUsers;
const getUser = getOne(User, getUserCrudOptions);

const prepareUpdateUserRouteMiddleware = (req, res, next) => {
  Object.keys(req.body).forEach((key) => {
    if (!allowedUpdateFieldsForUsers.includes(key)) delete req.body[key];
  });

  req.params.id = req.user._id;

  next();
};

const updateUserCrudOptions = new CRUDOptions();
updateUserCrudOptions.selectOptions = allowedVisibleFieldsForUsers;
const updateUser = updateOne(User, updateUserCrudOptions);

const prepareGetAllJoinedProjectsMiddleware = catchAsync(
  async (req, res, next) => {
    const projectIds = await ProjectMember.find({
      memberId: req.user._id,
    }).distinct("projectId");
    req.body = { _id: { $in: projectIds } };
    next();
  }
);

const prepareGetCurrentUserProfileMiddleware = (req, res, next) => {
  req.params.id = req.user._id;
  next();
};

module.exports = {
  getUser,
  prepareGetAllJoinedProjectsMiddleware,
  prepareGetCurrentUserProfileMiddleware,
  prepareUpdateUserRouteMiddleware,
  updateUser,
};
