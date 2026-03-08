import pandas as pd
import os
import sys

# ─── Resolve paths relative to this script ───
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.join(SCRIPT_DIR, "..")
RESULTS_DIR = os.path.join(PROJECT_ROOT, "results")

result_csv_path = os.path.join(RESULTS_DIR, "result.csv")
report_pdf_path = os.path.join(RESULTS_DIR, "report.pdf")

# Check if results exist
if not os.path.exists(result_csv_path):
    print("Error: result.csv not found. Run backtest first.")
    sys.exit(1)

# Load results
data = pd.read_csv(result_csv_path)

initial_capital = 10000
final_value = data["equity"].iloc[-1]
total_return = ((final_value - initial_capital) / initial_capital) * 100

# Calculate max drawdown
equity_series = data["equity"]
cumulative_max = equity_series.cummax()
drawdown = (equity_series - cumulative_max) / cumulative_max * 100
max_drawdown = drawdown.min()

# Calculate sharpe ratio
returns = equity_series.pct_change().dropna()
sharpe_ratio = returns.mean() / returns.std() if returns.std() != 0 else 0

try:
    from reportlab.lib.pagesizes import letter
    from reportlab.pdfgen import canvas

    c = canvas.Canvas(report_pdf_path, pagesize=letter)

    c.setFont("Helvetica-Bold", 18)
    c.drawString(200, 750, "Backtesting Report")

    c.setFont("Helvetica", 12)
    c.drawString(100, 700, f"Initial Capital: ${initial_capital:,.2f}")
    c.drawString(100, 675, f"Final Value: ${round(final_value, 2):,.2f}")
    c.drawString(100, 650, f"Total Return: {round(total_return, 2)}%")
    c.drawString(100, 625, f"Sharpe Ratio: {round(sharpe_ratio, 4)}")
    c.drawString(100, 600, f"Max Drawdown: {round(max_drawdown, 2)}%")
    c.drawString(100, 565, "Strategy: SMA Crossover")
    c.drawString(100, 540, "Rule: BUY when close > SMA20")

    c.save()
    print("PDF report generated successfully")

except ImportError:
    # reportlab not installed — create a simple text-based fallback
    with open(report_pdf_path, "w") as f:
        f.write("Backtesting Report\n")
        f.write(f"Initial Capital: ${initial_capital:,.2f}\n")
        f.write(f"Final Value: ${round(final_value, 2):,.2f}\n")
        f.write(f"Total Return: {round(total_return, 2)}%\n")
        f.write(f"Sharpe Ratio: {round(sharpe_ratio, 4)}\n")
        f.write(f"Max Drawdown: {round(max_drawdown, 2)}%\n")
    print("PDF report generated (text fallback — install reportlab for proper PDF)")