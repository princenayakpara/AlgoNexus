import json
import os
import sys
from typing import List, Dict, Any

import pandas as pd

from backtest import run_sma_crossover, run_baseline_sma, DATA_DIR, RESULTS_DIR


SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.join(SCRIPT_DIR, "..")
COMPARE_CONFIG_PATH = os.path.join(PROJECT_ROOT, "engine", "compare_config.json")


def load_config() -> Dict[str, Any]:
    if not os.path.exists(COMPARE_CONFIG_PATH):
        print(json.dumps({"error": f"compare_config.json not found at {COMPARE_CONFIG_PATH}"}))
        sys.exit(1)
    with open(COMPARE_CONFIG_PATH, "r") as f:
        return json.load(f)


def load_dataset(csv_filename: str) -> pd.DataFrame:
    csv_path = os.path.join(DATA_DIR, csv_filename)
    if not os.path.exists(csv_path):
        print(json.dumps({"error": f"Dataset not found: {csv_path}"}))
        sys.exit(1)
    data = pd.read_csv(csv_path)
    if "date" in data.columns:
        data["date"] = pd.to_datetime(data["date"])
    return data


def compute_metrics(equity: List[float], initial_capital: float) -> Dict[str, Any]:
    final_value = round(float(equity[-1]), 2)
    total_return = round((final_value - initial_capital) / initial_capital * 100, 2)

    returns = pd.Series(equity).pct_change().dropna()
    sharpe_ratio = round(float(returns.mean() / returns.std()), 4) if returns.std() != 0 else 0.0

    equity_series = pd.Series(equity)
    cumulative_max = equity_series.cummax()
    drawdown = (equity_series - cumulative_max) / cumulative_max * 100
    max_drawdown = round(float(drawdown.min()), 2)

    return {
        "finalValue": final_value,
        "totalReturn": total_return,
        "sharpeRatio": sharpe_ratio,
        "maxDrawdown": max_drawdown,
    }


def run_strategy_on_data(strategy: Dict[str, Any], data: pd.DataFrame) -> Dict[str, Any]:
    cfg = strategy.get("config") or {}
    s_type = (cfg.get("type") or "").upper()

    if s_type == "CROSSOVER" and cfg.get("indicator1") and cfg.get("indicator2"):
        fast_period = int(cfg["indicator1"].get("period") or 20)
        slow_period = int(cfg["indicator2"].get("period") or 50)
        backtest_df, initial_capital = run_sma_crossover(data, fast=fast_period, slow=slow_period)
    else:
        backtest_df, initial_capital = run_baseline_sma(data)

    equity = backtest_df["equity"].tolist()
    metrics = compute_metrics(equity, initial_capital)
    return {
        "name": strategy.get("name") or f"Strategy {strategy.get('id')}",
        **metrics,
    }


def main():
    config = load_config()
    csv_file = config.get("csvFile") or "sample.csv"
    strategies = config.get("strategies") or []

    if not strategies:
        print(json.dumps({"error": "No strategies provided in compare_config.json"}))
        sys.exit(1)

    data = load_dataset(csv_file)

    results: List[Dict[str, Any]] = []
    for strategy in strategies:
        try:
            result = run_strategy_on_data(strategy, data)
            results.append(result)
        except Exception as exc:
            results.append(
                {
                    "name": strategy.get("name") or "Unnamed",
                    "error": str(exc),
                }
            )

    # Persist a simple comparison CSV alongside normal results directory
    os.makedirs(RESULTS_DIR, exist_ok=True)
    comparison_csv = os.path.join(RESULTS_DIR, "strategy_comparison.csv")
    pd.DataFrame(results).to_csv(comparison_csv, index=False)

    print("STRATEGY_COMPARISON_JSON:" + json.dumps(results))


if __name__ == "__main__":
    main()

