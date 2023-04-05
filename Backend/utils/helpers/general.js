const { HandledError } = require("../errorHandling");

const findDocumentById = async (Model, id) => {
  const doc = await Model.findById(id);
  if (!doc) {
    const modelName = Model.modelName.toLowerCase();
    throw new HandledError(
      `No ${modelName}s found with specified id (${id})`,
      404
    );
  }
  return doc;
};

module.exports = { findDocumentById };
