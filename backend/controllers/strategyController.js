const path = require("path");
const fs = require("fs");

const PROJECT_ROOT = path.join(__dirname, "..", "..");

let strategies = [];

const createStrategy = (req, res) => {
  if (!req.body) {
    res.status(400);
    throw new Error("Request body is missing");
  }

  const { name, rule, config } = req.body;

  if (!name || !rule) {
    res.status(400);
    throw new Error("name and rule are required");
  }

  const strategy = {
    id: strategies.length + 1,
    name,
    rule,
    config: config || null
  };

  strategies.push(strategy);

  try {
    const strategyConfigPath = path.join(PROJECT_ROOT, "engine", "strategy_config.json");
    fs.writeFileSync(strategyConfigPath, JSON.stringify(strategy, null, 2), "utf-8");
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("Failed to write strategy_config.json:", e.message);
  }

  res.json({
    message: "Strategy created",
    strategy
  });
};

const listStrategies = (req, res) => {
  res.json({
    strategies
  });
};

module.exports = {
  createStrategy,
  listStrategies
};

