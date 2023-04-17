const User = require("../models/user");
const ProjectMember = require("../models/projectMember");
const CRUDOptions = require("../utils/crudOptions");
const { catchAsync } = require("../utils/errorHandling");
const { getOne } = require("./crud");

const getUserCrudOptions = new CRUDOptions();
getUserCrudOptions.selectOptions = "name jobTitle description email";
const getUser = getOne(User, getUserCrudOptions);

const prepareGetAllJoinedProjectsMiddleware = catchAsync(
  async (req, res, next) => {
    const projectIds = await ProjectMember.find({
      memberId: req.user._id,
    }).distinct("projectId");
    req.body = { _id: { $in: projectIds } };
    next();
  }
);

module.exports = { getUser, prepareGetAllJoinedProjectsMiddleware };
