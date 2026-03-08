const express = require("express")
const cors = require("cors")
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const { exec } = require("child_process")

const app = express()

app.use(cors())
app.use(express.json())

require("dotenv").config()

const PORT = process.env.PORT || 5000

// =====================
// Project root directory
// =====================
const PROJECT_ROOT = path.join(__dirname, "..")

// =====================
// CSV Upload Setup
// =====================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dataDir = path.join(__dirname, "data")
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }
    cb(null, dataDir)
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage: storage })

let strategies = []
let activeStrategy = null

// =====================
// Test Route
// =====================
app.get("/", (req, res) => {
  res.send("Backtesting API Running")
})

// =====================
// Upload CSV Route
// =====================
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      message: "No file uploaded"
    })
  }
  res.json({
    message: "CSV uploaded successfully",
    file: req.file.filename
  })
})

// =====================
// Run Backtest Route
// =====================
app.post("/run-backtest", (req, res) => {

  const scriptPath = path.join(__dirname, "..", "engine", "backtest.py")

  // Run with cwd set to project root so relative paths inside the script work
  exec(`python "${scriptPath}"`, { cwd: PROJECT_ROOT, timeout: 60000 }, (error, stdout, stderr) => {

    if (error) {
      console.error("Backtest error:", error.message)
      if (stderr) console.error("stderr:", stderr)
      return res.status(500).json({
        message: "Backtest failed",
        error: error.message
      })
    }

    // Parse structured metrics from engine stdout
    // The engine outputs a line like: METRICS_JSON:{"initialCapital":10000,...}
    let metrics = null
    try {
      const metricsPath = path.join(PROJECT_ROOT, "results", "metrics.json")
      if (fs.existsSync(metricsPath)) {
        metrics = JSON.parse(fs.readFileSync(metricsPath, "utf-8"))
      }
    } catch (e) {
      console.error("Failed to parse metrics JSON from file:", e.message)
    }

    // If parsing failed, provide fallback metrics from result.csv
    if (!metrics) {
      try {
        const resultPath = path.join(PROJECT_ROOT, "results", "result.csv")
        if (fs.existsSync(resultPath)) {
          const csvData = fs.readFileSync(resultPath, "utf-8")
          const rows = csvData.trim().split("\n")
          const headers = rows[0].split(",")
          const lastRow = rows[rows.length - 1].split(",")
          const equityIdx = headers.indexOf("equity")
          if (equityIdx !== -1) {
            const finalValue = parseFloat(lastRow[equityIdx])
            metrics = {
              initialCapital: 10000,
              finalValue: Math.round(finalValue * 100) / 100,
              totalReturn: Math.round((finalValue - 10000) / 10000 * 100 * 100) / 100,
              sharpeRatio: 0,
              maxDrawdown: 0
            }
          }
        }
      } catch (e) {
        console.error("Fallback metrics extraction failed:", e.message)
      }
    }

    // Chain report generation (fire-and-forget, don't block response)
    const reportScript = path.join(__dirname, "..", "engine", "generate_report.py")
    exec(`python "${reportScript}"`, { cwd: PROJECT_ROOT }, (reportError) => {
      if (reportError) {
        console.error("Report generation failed:", reportError.message)
      }
    })

    res.json({
      message: "Backtest completed successfully",
      metrics: metrics || {},
      output: stdout
    })
  })
})

// =====================
// Get Results (CSV)
// =====================
app.get("/results", (req, res) => {

  const filePath = path.join(__dirname, "..", "results", "result.csv")

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      message: "No backtest results found"
    })
  }

  const data = fs.readFileSync(filePath, "utf-8")

  res.json({
    message: "Backtest results",
    data: data
  })
})

// =====================
// Create Strategy
// =====================
app.post("/strategy", (req, res) => {

  if (!req.body) {
    return res.status(400).json({
      message: "Request body is missing"
    })
  }

  const { name, rule, config } = req.body

  if (!name || !rule) {
    return res.status(400).json({
    message: "name and rule are required"
    })
  }

  const strategy = {
    id: strategies.length + 1,
    name,
    rule,
    config: config || null
  }

  strategies.push(strategy)

  // Persist latest strategy configuration for Python engine
  try {
    const strategyConfigPath = path.join(PROJECT_ROOT, "engine", "strategy_config.json")
    fs.writeFileSync(strategyConfigPath, JSON.stringify(strategy, null, 2), "utf-8")
    activeStrategy = strategy
  } catch (e) {
    console.error("Failed to write strategy_config.json:", e.message)
  }

  res.json({
    message: "Strategy created",
    strategy
  })
})

app.get("/strategy", (req, res) => {
  res.json({
    strategies
  })
})

// =====================
// Get Equity Chart Image
// =====================
app.get("/equity-curve", (req, res) => {

  const imgPath = path.join(__dirname, "..", "results", "equity.png")

  if (!fs.existsSync(imgPath)) {
    return res.status(404).json({
      message: "Equity curve not available. Run a backtest first."
    })
  }

  res.sendFile(imgPath)
})

// =====================
// Download PDF Report
// =====================
app.get("/results/report.pdf", (req, res) => {

  const pdfPath = path.join(__dirname, "..", "results", "report.pdf")

  if (!fs.existsSync(pdfPath)) {
    return res.status(404).json({
      message: "Report not available. Run a backtest first."
    })
  }

  res.setHeader("Content-Type", "application/pdf")
  res.setHeader("Content-Disposition", "attachment; filename=backtest_report.pdf")
  res.sendFile(pdfPath)
})

// =====================
app.listen(5000, () => {
  console.log("Server running on port 5000")
})