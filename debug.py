import pandas as pd
import json

from engine.backtest import run_sma_crossover

def test():
    data = pd.read_csv("backend/data/sample.csv")
    data.columns = [str(col).lower().strip() for col in data.columns]
    df, cap = run_sma_crossover(data, 5, 15)
    print(df[['close', 'fast_sma', 'slow_sma', 'equity']].tail(20))

if __name__ == "__main__":
    test()
