const Project = require("../models/project");
const crud = require("./crud");

const setOwnerId = (req, res, next) => {
  req.body.owner = req.user._id;
  next();
};

const createProject = crud.createOne(Project);

module.exports = { createProject, setOwnerId };
