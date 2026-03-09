const path = require("path");
const fs = require("fs");
const { runPythonBacktest, runReportGeneration } = require("../services/backtestService");

const getResults = (req, res) => {
  const filePath = path.join(__dirname, "..", "..", "results", "result.csv");

  if (!fs.existsSync(filePath)) {
    res.status(404);
    throw new Error("No backtest results found");
  }

  const data = fs.readFileSync(filePath, "utf-8");
  res.json({
    message: "Backtest results",
    data
  });
};

const getEquityCurve = (req, res) => {
  const imgPath = path.join(__dirname, "..", "..", "results", "equity.png");

  if (!fs.existsSync(imgPath)) {
    res.status(404);
    throw new Error("Equity curve not available. Run a backtest first.");
  }

  res.sendFile(imgPath);
};

const getReportPdf = (req, res) => {
  const pdfPath = path.join(__dirname, "..", "..", "results", "report.pdf");

  if (!fs.existsSync(pdfPath)) {
    res.status(404);
    throw new Error("Report not available. Run a backtest first.");
  }

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=backtest_report.pdf");
  res.sendFile(pdfPath);
};

const runBacktest = async (req, res) => {
  const { filename } = req.body;
  try {
    const { metrics, stdout } = await runPythonBacktest(filename);
    await runReportGeneration();

    res.json({
      message: "Backtest completed successfully",
      metrics,
      output: stdout
    });
  } catch (error) {
    res.status(500);
    throw new Error("Failed to run backtest or generate report");
  }
};

module.exports = {
  runBacktest,
  getResults,
  getEquityCurve,
  getReportPdf
};

