# AlgoNexus — Algorithmic Trading Backtesting Platform

## 🚀 One-Sentence Elevator Pitch
AlgoNexus is a professional, full-stack algorithmic trading backtesting platform that empowers traders and quantitative analysts to rapidly prototype, validate, and visualize custom trading strategies using historical market data.

## ⚠️ The Problem
Quantitative trading is often inaccessible to non-programmers or independent traders. Building robust backtesting engines requires deep technical expertise in data science, finance, and software engineering. Existing platforms are either too complex (requiring Python/C++ skills), locked behind expensive enterprise subscriptions, or lack visual clarity when interpreting results.

## 💡 Our Solution
We built **AlgoNexus**, an intuitive, high-performance backtesting dashboard that abstracts away the complexity of algorithmic trading. It bridges the gap between sophisticated Python-based quantitative analysis and a user-friendly, real-time web interface. Users can define trading logic in plain text, run institutional-grade backtests against custom historical data, and instantly visualize actionable performance metrics and equity curves—all within a seamless fintech UI.

## ✨ Key Features
- **Historical Data Import**: Effortless drag-and-drop CSV dataset uploads for custom market data.
- **Strategy Designer**: Intuitive interface to define custom entry/exit logic with built-in templates (SMA Crossover, RSI Reversal, Bollinger Breakout).
- **High-Performance Execution**: Robust Python/Pandas-driven backtesting engine for rapid bar-by-bar simulation.
- **Advanced Performance Metrics**: Real-time calculation of Total Return, Sharpe Ratio, Max Drawdown, and Final Equity.
- **Dynamic Visualization**: Interactive equity curve rendering to track portfolio growth and drawdowns.
- **Bar-by-Bar Analysis**: Deep-dive data table to inspect executed trades and indicator values.
- **PDF Report Generation**: One-click downloadable strategy reports for documentation and sharing.
- **Headless CLI Interface**: Developer-friendly CLI tool for automating backtests without the UI.

## 🏗️ Architecture
The platform is built on a decoupled, service-oriented architecture ensuring high performance and scalability:

**React Dashboard (Frontend)**  
`frontend/` — A responsive, fintech-style web interface built with React, Vite, and TailwindCSS. It provides dataset upload, strategy creation, backtest controls, metrics, equity curves, and results inspection.

**Node.js REST API (Backend)**  
`backend/` — A lightweight Express.js server that acts as the orchestrator. It handles file uploads, manages strategy state, triggers the Python backtesting engine via subprocess calls, and serves results and generated assets.

**Python Backtesting Engine (Core)**  
`engine/` — The heavy-lifting computational engine powered by Pandas. It parses historical data, calculates technical indicators (e.g., Simple Moving Averages), simulates historical trades bar-by-bar based on user-defined strategies, and calculates advanced financial metrics.

**CLI Tool**  
`cli/` — A simple Python CLI wrapper around the REST API for headless automation.

**Data Flow:**
`React UI` → `Node.js API` → `Python Engine (Pandas)` → `Results (CSV/PNG/PDF)` → `Node.js API` → `React UI`

## 🛠️ Technology Stack
- **Frontend**: React, Vite, TailwindCSS, Recharts (Chart.js can be added easily)
- **Backend**: Node.js, Express.js, Axios, Multer, morgan
- **Data Engine**: Python, Pandas, Matplotlib, ReportLab
- **CLI**: Python requests-based CLI

## ⚙️ How It Works (Step-by-Step Flow)
1. **Upload Data**: The user drags and drops a CSV containing historical market data (OHLCV) into the QuantDesk UI. The file is uploaded to the backend via a REST API.
2. **Define Strategy**: The user selects or writes a trading strategy (e.g., "BUY when close > SMA20") in the Strategy Designer.
3. **Execute Backtest**: Clicking "Run Backtest" sends a signal to the Node.js API, which spins up a Python subprocess. The Python engine loads the CSV, calculates indicators, simulates the trades chronologically, and computes the metrics.
4. **Generate Artifacts**: The engine generates a `result.csv`, plots the equity curve (`equity.png`), and compiles a `report.pdf`.
5. **Visualize Results**: The Node.js API reads the generated metrics and streams them back to the React UI, which updates the metric cards, renders the equity chart, and populates the data table in real-time.

## 💻 Local Development

### 1. Backend (Node.js + Express)

From the project root:

```bash
npm install
cd backend
cp .env.example .env   # or create .env manually
cd ..
npm start              # runs node backend/server.js
```

Backend will start on `http://localhost:5000` by default.

### 2. Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at `http://localhost:5173`.

### 3. Python Backtesting Engine

Ensure Python 3 and pip are installed, then install requirements:

```bash
pip install -r engine/requirements.txt
```

The Node backend will invoke `engine/backtest.py` automatically when `/run-backtest` is called.

## ⌨️ CLI Usage
For developers and quants who prefer the terminal, AlgoNexus includes a fully functional Python CLI:

```bash
# Upload a dataset
python cli/cli.py upload backend/data/sample.csv

# Define a strategy
python cli/cli.py strategy

# Execute the backtest engine
python cli/cli.py run

# Fetch the raw CSV results
python cli/cli.py results

# Generate the PDF report
python cli/cli.py report
```

## 🔐 Google OAuth Setup
To enable authentication on AlgoNexus, you need a Google Client ID:
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing one.
3. Navigate to **APIs & Services** > **Credentials**.
4. Click **Create Credentials** > **OAuth client ID**.
5. Select "Web application". Add your local URLs (e.g., `http://localhost:5173`) to **Authorized JavaScript origins**.
6. Copy the **Client ID** and add it to `.env` (backend) as `GOOGLE_CLIENT_ID` and `frontend/.env` as `VITE_GOOGLE_CLIENT_ID`.
7. Also ensure a `JWT_SECRET` exists in the backend `.env`.

## 🚀 Render Deployment
AlgoNexus is optimized for deployment as a single Render Web Service:
1. Connect your repository to Render.
2. Create a new **Web Service**.
3. Set the Build Command to: `npm run build` (This runs the root build script which installs and builds the frontend).
4. Set the Start Command to: `npm start` (This starts the Node.js backend which serves the API and the static frontend UI).
5. Add the necessary Environment Variables:
   - `NODE_ENV=production`
   - `PORT=5000` (or leave blank if Render decides the port)
   - `GOOGLE_CLIENT_ID=<your-google-client-id>`
   - `VITE_GOOGLE_CLIENT_ID=<your-google-client-id>`
   - `JWT_SECRET=<your-random-jwt-secret>`
   - `PYTHON_SCRIPT=engine/backtest.py`

## 🔮 Monitoring & Future Improvements
- **Live Trading Integration**: Connect to broker APIs (Alpaca, Interactive Brokers) to deploy successful strategies to live markets.
- **Machine Learning Integration**: Implement predictive models alongside traditional technical indicators for AI-driven signal generation.
- **Monitoring**:
  - **Sentry**: capture backend errors by initializing `@sentry/node` in `backend/server.js`.
  - **LogRocket**: capture frontend session replays by initializing in the React entrypoint.

## 🏆 Why This Project Matters
Financial markets are a highly competitive arena where speed and data interpretation formulate the edge. AlgoNexus democratizes algorithmic trading. By providing a beautifully designed, intuitive abstraction over complex data pipelines, we lower the barrier to entry for quantitative finance. It proves that sophisticated institutional-grade tooling can be built with modern, accessible web technologies, allowing anyone to test their financial hypotheses with rigorous, mathematical precision.
