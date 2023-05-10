const express = require("express");
const taskController = require("../controllers/task");
const authController = require("../controllers/auth");

const router = express.Router({ mergeParams: true });

router.use(authController.checkAuthentication);
router
  .route("/")
  .get(taskController.prepareGetAllTasksQuery, taskController.getAllTasks)
  .post(taskController.createTask);
router
  .route("/:id")
  .patch(
    taskController.validateIfUserIsAllowedToMofidyTaskMiddleware,
    taskController.filterRequestBodyBeforeUpdateTaskMiddleware,
    taskController.prepareUpdateTaskOnFinishMiddleware,
    taskController.updateTask
  )
  .delete(
    taskController.validateIfUserIsAllowedToMofidyTaskMiddleware,
    taskController.prepareDeleteTaskOnFinishMiddleware,
    taskController.deleteTask
  );

module.exports = router;
