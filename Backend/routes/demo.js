const express = require("express");
const demoController = require("../controllers/demo");
const router = express.Router();

router
  .route("/")
  .post(demoController.createDemo)
  .get(demoController.getAllDemos);

router
  .route("/:id")
  .get(demoController.getDemo)
  .patch(demoController.updateDemo)
  .delete(demoController.deleteDemo);

module.exports = router;
