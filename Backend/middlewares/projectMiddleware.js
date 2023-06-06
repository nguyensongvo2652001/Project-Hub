const Notification = require("../models/notification");
const ProjectMember = require("../models/projectMember");
const { catchAsync, HandledError } = require("../utils/errorHandling");

const setProjectOwnerFieldBeforeCreateProjectMiddleware = (req, res, next) => {
  req.body.owner = req.user;
  next();
};

const validateIfUserIsOwnerOfTheProjectMiddleware = catchAsync(
  async (req, res, next) => {
    const { projectId } = req.params;

    const membership = await ProjectMember.findOne({
      memberId: req.user,
      projectId,
    });

    if (!membership) {
      return next(
        new HandledError(
          "can not find any membership with the provided data",
          404
        )
      );
    }

    if (membership.role !== "owner") {
      return next(
        new HandledError("only owner is allowed to perform this action", 403)
      );
    }

    next();
  }
);

const validateIfUserIsMemberOfProjectMiddleware = catchAsync(
  async (req, res, next) => {
    const { projectId } = req.params;

    const projectMember = await ProjectMember.findOne({
      memberId: req.user,
      projectId: projectId,
      status: "done",
    });

    // Here we do NOT count users that are invited but have NOT confirmed their membership (status === "pending")
    if (!projectMember) {
      return next(
        new HandledError(
          `you are not a member of project (id = ${projectId})`,
          403
        )
      );
    }

    next();
  }
);

const filterProjectDataMiddleware = (req, res, next) => {
  const acceptedFields = ["name", "description", "tag", "status"];
  const filteredProjectData = {};

  Object.keys(req.body).forEach((key) => {
    if (acceptedFields.includes(key)) {
      filteredProjectData[key] = req.body[key];
    }
  });

  req.body = filteredProjectData;

  next();
};

const filterOnlyPublicProjectsMiddleware = (req, res, next) => {
  req.body = { status: "public" };

  next();
};

const sortProjectsByDateCreatedMiddleware = (req, res, next) => {
  req.query.sort = "-dateCreated";

  next();
};

const updateProjectOnFinish = async (req, project) => {
  await Notification.create({
    initiator: req.user._id,
    type: process.env.NOTIFICATION_UPDATE_PROJECT_TYPE,
    scope: "project",
    receiver: project._id,
    detail: project,
  });

  project.lastChanged = Date.now();
  await project.save();
};

const prepareUpdateProjectMiddleware = (req, res, next) => {
  // After we update the project successfully, this function will be called
  req.onFinish = updateProjectOnFinish;

  // We use a generic update function (crud.updateOne) which we use req.params.id to find and update document so we need to set it to the req.params.projectId
  req.params.id = req.params.projectId;

  next();
};

module.exports = {
  setProjectOwnerFieldBeforeCreateProjectMiddleware,
  validateIfUserIsOwnerOfTheProjectMiddleware,
  validateIfUserIsMemberOfProjectMiddleware,
  filterProjectDataMiddleware,
  filterOnlyPublicProjectsMiddleware,
  prepareUpdateProjectMiddleware,
  sortProjectsByDateCreatedMiddleware,
};
