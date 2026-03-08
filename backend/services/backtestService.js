const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");

const PROJECT_ROOT = path.join(__dirname, "..", "..");

const runPythonBacktest = (filename) =>
  new Promise((resolve, reject) => {
    const scriptRelative = process.env.PYTHON_SCRIPT || "engine/backtest.py";
    const scriptPath = path.join(PROJECT_ROOT, scriptRelative);
    
    // Add the filename as an argument if it exists, otherwise use empty string (python script defaults to sample.csv)
    const pythonCommand = filename ? `python "${scriptPath}" "${filename}"` : `python "${scriptPath}"`;

    exec(pythonCommand, { cwd: PROJECT_ROOT, timeout: 600000 }, (error, stdout, stderr) => {
      if (error) {
        // eslint-disable-next-line no-console
        console.error("Backtest error:", error.message);
        console.error("stderr:", stderr);
        console.error("stdout:", stdout);
        return reject(new Error("Backtest failed"));
      }

      let metrics = null;
      try {
        const metricsPath = path.join(PROJECT_ROOT, "results", "metrics.json");
        if (fs.existsSync(metricsPath)) {
          metrics = JSON.parse(fs.readFileSync(metricsPath, "utf-8"));
        }
      } catch (e) {
        console.error("Failed to parse metrics JSON from file:", e.message);
      }

      if (!metrics) {
        try {
          const resultPath = path.join(PROJECT_ROOT, "results", "result.csv");
          if (fs.existsSync(resultPath)) {
            const csvData = fs.readFileSync(resultPath, "utf-8");
            const rows = csvData.trim().split("\n");
            const headers = rows[0].split(",");
            const lastRow = rows[rows.length - 1].split(",");
            const equityIdx = headers.indexOf("equity");
            if (equityIdx !== -1) {
              const finalValue = parseFloat(lastRow[equityIdx]);
              metrics = {
                initialCapital: 10000,
                finalValue: Math.round(finalValue * 100) / 100,
                totalReturn:
                  Math.round(((finalValue - 10000) / 10000) * 100 * 100) / 100,
                sharpeRatio: 0,
                maxDrawdown: 0
              };
            }
          }
        } catch (e) {
          console.error("Fallback metrics extraction failed:", e.message);
        }
      }

      resolve({ metrics: metrics || {}, stdout });
    });
  });

const runReportGeneration = () => {
  const reportScript = path.join(PROJECT_ROOT, "engine", "generate_report.py");
  exec(`python "${reportScript}"`, { cwd: PROJECT_ROOT }, (reportError) => {
    if (reportError) {
      // eslint-disable-next-line no-console
      console.error("Report generation failed:", reportError.message);
    }
  });
};

module.exports = {
  runPythonBacktest,
  runReportGeneration
};

