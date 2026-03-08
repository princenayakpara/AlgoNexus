import json
import os
import sys
from typing import List, Dict, Any

import pandas as pd

from backtest import RESULTS_DIR, DATA_DIR


SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.join(SCRIPT_DIR, "..")
PORTFOLIO_CONFIG_PATH = os.path.join(PROJECT_ROOT, "engine", "portfolio_config.json")


def load_config() -> Dict[str, Any]:
    if not os.path.exists(PORTFOLIO_CONFIG_PATH):
        print(json.dumps({"error": f"portfolio_config.json not found at {PORTFOLIO_CONFIG_PATH}"}))
        sys.exit(1)
    with open(PORTFOLIO_CONFIG_PATH, "r") as f:
        return json.load(f)


def load_asset(csv_filename: str, symbol: str) -> pd.DataFrame:
    csv_path = os.path.join(DATA_DIR, csv_filename)
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"Dataset for {symbol} not found: {csv_path}")
    df = pd.read_csv(csv_path)
    if "date" not in df.columns or "close" not in df.columns:
        raise ValueError(f"CSV for {symbol} must contain date and close columns")
    df["date"] = pd.to_datetime(df["date"])
    df = df[["date", "close"]].rename(columns={"close": f"close_{symbol}"})
    return df


def main():
    config = load_config()
    portfolio: List[Dict[str, Any]] = config.get("portfolio") or []

    if not portfolio:
        print(json.dumps({"error": "Portfolio is empty in portfolio_config.json"}))
        sys.exit(1)

    # Normalize weights
    weights = [float(a.get("weight") or 0.0) for a in portfolio]
    total_weight = sum(weights)
    if total_weight == 0:
        print(json.dumps({"error": "Sum of portfolio weights must be > 0"}))
        sys.exit(1)

    normalized_weights = [w / total_weight for w in weights]

    # Load and merge asset price series
    merged: pd.DataFrame | None = None
    for (asset, weight) in zip(portfolio, normalized_weights):
        symbol = asset.get("symbol")
        csv_file = asset.get("csvFile")
        if not symbol or not csv_file:
            continue
        df = load_asset(csv_file, symbol)
        if merged is None:
            merged = df
        else:
            merged = pd.merge(merged, df, on="date", how="inner")

    if merged is None or merged.empty:
        print(json.dumps({"error": "No overlapping data for portfolio assets"}))
        sys.exit(1)

    merged = merged.sort_values("date")

    # Compute daily returns per asset
    return_cols = []
    for asset, weight in zip(portfolio, normalized_weights):
        symbol = asset.get("symbol")
        price_col = f"close_{symbol}"
        if price_col not in merged.columns:
            continue
        ret_col = f"ret_{symbol}"
        merged[ret_col] = merged[price_col].pct_change().fillna(0.0)
        return_cols.append((ret_col, weight))

    if not return_cols:
        print(json.dumps({"error": "No valid asset return columns computed"}))
        sys.exit(1)

    # Portfolio daily return as weighted sum
    merged["portfolio_ret"] = 0.0
    for ret_col, weight in return_cols:
        merged["portfolio_ret"] += merged[ret_col] * weight

    initial_capital = 10000.0
    merged["equity"] = initial_capital * (1.0 + merged["portfolio_ret"]).cumprod()

    equity = merged["equity"].tolist()
    final_value = float(equity[-1])
    total_return = (final_value - initial_capital) / initial_capital * 100.0

    returns = pd.Series(equity).pct_change().dropna()
    sharpe_ratio = float(returns.mean() / returns.std()) if returns.std() != 0 else 0.0

    equity_series = pd.Series(equity)
    cumulative_max = equity_series.cummax()
    drawdown = (equity_series - cumulative_max) / cumulative_max * 100.0
    max_drawdown = float(drawdown.min())

    os.makedirs(RESULTS_DIR, exist_ok=True)
    portfolio_csv = os.path.join(RESULTS_DIR, "portfolio_result.csv")
    merged.to_csv(portfolio_csv, index=False)

    metrics = {
        "initialCapital": initial_capital,
        "finalValue": round(final_value, 2),
        "totalReturn": round(total_return, 2),
        "sharpeRatio": round(sharpe_ratio, 4),
        "maxDrawdown": round(max_drawdown, 2),
    }

    print("PORTFOLIO_METRICS_JSON:" + json.dumps(metrics))


if __name__ == "__main__":
    main()

