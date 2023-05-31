const express = require("express");

const taskController = require("../controllers/task");

const authMiddleware = require("../middlewares/authMiddleware");
const taskMiddleware = require("../middlewares/taskMiddleware");

const router = express.Router({ mergeParams: true });

router.use(authMiddleware.validateIfUserLoggedIn);

router.route("/").post(taskController.createTask);

router
  .route("/:taskId")
  .all(
    taskMiddleware.setRequestParamsIdMiddleware,
    taskMiddleware.validateIfUserIsAllowedToViewTaskMiddleware
  )
  .patch(
    taskMiddleware.validateIfUserIsAllowedToMofidyTaskMiddleware,
    taskMiddleware.filterRequestBodyBeforeUpdateTaskMiddleware,
    taskMiddleware.prepareUpdateTaskOnFinishMiddleware,
    taskController.updateTask
  )
  .delete(
    taskMiddleware.validateIfUserIsAllowedToMofidyTaskMiddleware,
    taskMiddleware.prepareDeleteTaskOnFinishMiddleware,
    taskController.deleteTask
  )
  .get(taskController.getTask);

module.exports = router;
