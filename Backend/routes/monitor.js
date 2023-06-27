const express = require("express");

const router = express.Router();
const monitorController = require("../controllers/monitor");

router.get("/numberOfRequests", monitorController.getNumberOfRequests);

module.exports = router;
