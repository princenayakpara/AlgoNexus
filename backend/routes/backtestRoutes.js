const express = require("express");
const { runBacktest, getResults, getEquityCurve, getReportPdf } = require("../controllers/backtestController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/run-backtest", protect, runBacktest);
router.get("/results", protect, getResults);
router.get("/equity-curve", getEquityCurve);
router.get("/results/report.pdf", getReportPdf);

module.exports = router;

