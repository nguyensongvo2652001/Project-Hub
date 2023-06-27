const express = require("express");

const router = express.Router();
const monitorController = require("../controllers/monitor");

router.get("/numberOfRequests", monitorController.getNumberOfRequests);
router.get("/averageProcessTime", monitorController.getAverageProcessTime);

module.exports = router;
