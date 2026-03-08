import requests
import sys

API = "http://localhost:5000"


def upload(file):
    files = {"file": open(file, "rb")}
    r = requests.post(f"{API}/upload", files=files)
    print(r.json())


def create_strategy():
    data = {
        "name": "SMA Strategy",
        "rule": "BUY when close > SMA20"
    }

    r = requests.post(f"{API}/strategy", json=data)
    print(r.json())


def run_backtest():
    r = requests.post(f"{API}/run-backtest")
    print(r.json())


def get_results():
    r = requests.get(f"{API}/results")
    print(r.json())

def report():
    import subprocess
    subprocess.run(["python","engine/generate_report.py"])


if __name__ == "__main__":

    command = sys.argv[1]

    if command == "upload":
        upload(sys.argv[2])

    elif command == "strategy":
        create_strategy()

    elif command == "run":
        run_backtest()

    elif command == "results":
        get_results()
    
    elif command == "report":
        report()

    else:
        print("Commands:")
        print("upload <file>")
        print("strategy")
        print("run")
        print("results")