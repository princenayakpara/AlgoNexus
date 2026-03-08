import pandas as pd
import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import os
import json
import sys

# ─── Resolve paths relative to this script ───
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.join(SCRIPT_DIR, "..")
DATA_DIR = os.path.join(PROJECT_ROOT, "backend", "data")
RESULTS_DIR = os.path.join(PROJECT_ROOT, "results")
STRATEGY_CONFIG_PATH = os.path.join(PROJECT_ROOT, "engine", "strategy_config.json")

# Ensure results directory exists
os.makedirs(RESULTS_DIR, exist_ok=True)


def load_strategy_config():
  if not os.path.exists(STRATEGY_CONFIG_PATH):
    return None
  try:
    with open(STRATEGY_CONFIG_PATH, "r") as f:
      return json.load(f)
  except Exception as exc:
    print(f"Warning: failed to load strategy_config.json: {exc}")
    return None


def run_sma_crossover(data: pd.DataFrame, fast: int = 20, slow: int = 50):
  data = data.copy()
  data["fast_sma"] = data["close"].rolling(window=fast).mean()
  data["slow_sma"] = data["close"].rolling(window=slow).mean()

  initial_capital = 10000
  capital = initial_capital
  position = 0.0
  equity = []
  prev_fast_above = None

  for _, row in data.iterrows():
    price = float(row["close"])
    fast_sma = row["fast_sma"]
    slow_sma = row["slow_sma"]

    if pd.isna(fast_sma) or pd.isna(slow_sma):
      equity.append(capital + position * price)
      continue

    fast_above = fast_sma > slow_sma

    if prev_fast_above is not None:
      if not prev_fast_above and fast_above and position == 0:
        position = capital / price
        capital = 0.0
      elif prev_fast_above and not fast_above and position > 0:
        capital = position * price
        position = 0.0

    prev_fast_above = fast_above
    equity.append(capital + position * price)

  data["equity"] = equity
  return data, initial_capital


def run_baseline_sma(data: pd.DataFrame):
  data = data.copy()
  data["sma20"] = data["close"].rolling(window=5).mean()

  initial_capital = 10000
  capital = initial_capital
  position = 0.0
  equity = []

  for _, row in data.iterrows():
    price = float(row["close"])
    sma = row["sma20"]

    if pd.isna(sma):
      equity.append(capital + position * price)
      continue

    if price > sma and position == 0:
      position = capital / price
      capital = 0.0
    elif price < sma and position > 0:
      capital = position * price
      position = 0.0

    equity.append(capital + position * price)

  data["equity"] = equity
  return data, initial_capital


def extract_pdf_data(pdf_path):
  try:
    import pdfplumber
  except ImportError:
    print(json.dumps({"error": "pdfplumber not installed. Cannot read PDF"}))
    sys.exit(1)

  all_data = []
  with pdfplumber.open(pdf_path) as pdf:
    for page in pdf.pages:
      table = page.extract_table()
      if table:
        all_data.extend(table)
  
  if not all_data:
    print(json.dumps({"error": "No tables found in PDF"}))
    sys.exit(1)
  
  # Assume first row represents the header
  headers = all_data[0]
  headers = [str(h).lower() for h in headers]
  df = pd.DataFrame(all_data[1:], columns=headers)
  
  # Ensure columns have correct types
  for col in df.columns:
    if col != 'date':
      df[col] = pd.to_numeric(df[col].astype(str).str.replace(',', ''), errors='coerce')
  
  return df

def main():
  filename = "sample.csv"
  if len(sys.argv) > 1:
    filename = sys.argv[1]

  file_path = os.path.join(DATA_DIR, filename)
  if not os.path.exists(file_path):
    print(json.dumps({"error": f"Dataset not found: {file_path}"}))
    sys.exit(1)

  if filename.lower().endswith('.pdf'):
    data = extract_pdf_data(file_path)
  else:
    data = pd.read_csv(file_path)

  if "date" in data.columns:
    data["date"] = pd.to_datetime(data["date"])

  strategy = load_strategy_config() or {}
  config = strategy.get("config") or {}
  strategy_type = (config.get("type") or "").upper()

  if strategy_type == "CROSSOVER" and config.get("indicator1") and config.get("indicator2"):
    fast_period = int(config["indicator1"].get("period") or 20)
    slow_period = int(config["indicator2"].get("period") or 50)
    backtest_df, initial_capital = run_sma_crossover(data, fast=fast_period, slow=slow_period)
  else:
    backtest_df, initial_capital = run_baseline_sma(data)

  equity = backtest_df["equity"].tolist()

  final_value = round(equity[-1], 2)
  total_return = round((final_value - initial_capital) / initial_capital * 100, 2)

  returns = pd.Series(equity).pct_change().dropna()
  sharpe_ratio = round(float(returns.mean() / returns.std()) if returns.std() != 0 else 0, 4)

  equity_series = pd.Series(equity)
  cumulative_max = equity_series.cummax()
  drawdown = (equity_series - cumulative_max) / cumulative_max * 100
  max_drawdown = round(float(drawdown.min()), 2)

  result_csv_path = os.path.join(RESULTS_DIR, "result.csv")
  backtest_df.to_csv(result_csv_path, index=False)

  plt.figure(figsize=(10, 5))
  plt.style.use("dark_background")
  x_axis = backtest_df["date"] if "date" in backtest_df.columns else backtest_df.index
  plt.plot(x_axis, backtest_df["equity"], color="#00ff88", linewidth=2)
  plt.title("Equity Curve", fontsize=14, fontweight="bold")
  plt.xlabel("Date" if "date" in backtest_df.columns else "Step")
  plt.ylabel("Equity ($)")
  plt.grid(True, alpha=0.3)
  plt.tight_layout()

  equity_png_path = os.path.join(RESULTS_DIR, "equity.png")
  plt.savefig(equity_png_path, dpi=100)
  plt.close()

  print("========== Backtest Results ==========")
  print(f"Initial Capital: {initial_capital}")
  print(f"Final Value: {final_value}")
  print(f"Total Return: {total_return}%")
  print(f"Sharpe Ratio: {sharpe_ratio}")
  print(f"Max Drawdown: {max_drawdown}%")
  print("Backtest completed successfully")

  metrics = {
    "initialCapital": initial_capital,
    "finalValue": final_value,
    "totalReturn": total_return,
    "sharpeRatio": sharpe_ratio,
    "maxDrawdown": max_drawdown,
  }
  metrics_path = os.path.join(RESULTS_DIR, "metrics.json")
  with open(metrics_path, "w") as f:
    json.dump(metrics, f)


if __name__ == "__main__":
  main()