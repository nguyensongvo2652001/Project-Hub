const { HandledError, catchAsync } = require("../utils/errorHandling");
const APIFeatures = require("../utils/apiFeatures");

const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const newDoc = await Model.create(req.body);
    const modelName = Model.modelName.toLowerCase();

    res.status(201).json({
      status: "success",
      data: {
        [modelName]: newDoc,
      },
    });
  });

const getAll = (Model, crudOptions) =>
  catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Model.find(req.body), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const docs = await features.query;
    const modelName = Model.modelName.toLowerCase();
    const pluralModelName = `${modelName}s`;

    res.status(200).json({
      status: "success",
      data: {
        length: docs.length,
        [pluralModelName]: docs,
      },
    });
  });

const getOne = (Model, crudOptions) =>
  catchAsync(async (req, res, next) => {
    let selectOptions = "";
    if (crudOptions) {
      selectOptions = crudOptions.selectOptions;
    }

    const doc = await Model.findById(req.params.id).select(selectOptions);
    const modelName = Model.modelName.toLowerCase();

    if (!doc) {
      return next(new HandledError(`No ${modelName} found with that id`, 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        [modelName]: doc,
      },
    });
  });

const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
      runValidators: true,
    });

    const modelName = Model.modelName.toLowerCase();

    if (!doc) {
      return next(new HandledError(`No ${modelName} found with that id`, 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        [Model.modelName.toLowerCase()]: doc,
      },
    });
  });

const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    const modelName = Model.modelName.toLowerCase();

    if (!doc) {
      return next(new HandledError(`No ${modelName} found with that id`, 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

module.exports = { createOne, getOne, getAll, updateOne, deleteOne };
