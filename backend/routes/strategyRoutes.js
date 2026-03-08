const express = require("express");
const { createStrategy, listStrategies } = require("../controllers/strategyController");

const router = express.Router();

router.post("/strategy", createStrategy);
router.get("/strategy", listStrategies);

module.exports = router;

