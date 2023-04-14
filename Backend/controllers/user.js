const User = require("../models/user");
const CRUDOptions = require("../utils/crudOptions");
const { getOne } = require("./crud");

const getUserCrudOptions = new CRUDOptions();
getUserCrudOptions.selectOptions = "name jobTitle description email";
const getUser = getOne(User, getUserCrudOptions);

module.exports = { getUser };
