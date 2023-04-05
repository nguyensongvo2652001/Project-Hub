const Demo = require("../models/demo");
const crud = require("./crud");

const createDemo = crud.createOne(Demo);
const getDemo = crud.getOne(Demo);
const getAllDemos = crud.getAll(Demo);
const updateDemo = crud.updateOne(Demo);
const deleteDemo = crud.deleteOne(Demo);

module.exports = { createDemo, getDemo, getAllDemos, updateDemo, deleteDemo };
