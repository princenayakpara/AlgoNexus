import React, { useState } from 'react';
import UploadCard from './components/UploadCard.jsx';
import StrategyCard from './components/StrategyCard.jsx';
import RunBacktest from './components/RunBacktest.jsx';
import Metrics from './components/Metrics.jsx';
import EquityChart from './components/EquityChart.jsx';
import DataTable from './components/DataTable.jsx';
import { runBacktest, fetchResultsCsv } from './services/api.js';
import Papa from 'papaparse';

import { GoogleLogin, googleLogout } from '@react-oauth/google';
import TutorialManual from './components/TutorialManual.jsx';
import { googleLogin as backendGoogleLogin, fetchCurrentUser } from './services/api.js';

const App = () => {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [metrics, setMetrics] = useState(null);
  const [equitySeries, setEquitySeries] = useState([]);
  const [resultsColumns, setResultsColumns] = useState([]);
  const [resultsRows, setResultsRows] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [backtestError, setBacktestError] = useState(null);
  const [lastRunAt, setLastRunAt] = useState(null);
  const [uploadedFilename, setUploadedFilename] = useState(null);

  React.useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { user } = await fetchCurrentUser();
          setUser(user);
        } catch (error) {
          console.error('Session expired or invalid', error);
          localStorage.removeItem('token');
        }
      }
      setIsAuthLoading(false);
    };
    initAuth();
  }, []);

  // Cleaned up unused useGoogleLogin hook

  const parseBacktestCsv = (csvText) => {
    const text = typeof csvText === 'string' ? csvText : csvText?.data || '';
    const parsed = Papa.parse(text.trim(), {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true
    });

    const columns = parsed.meta.fields || [];
    const rows = Array.isArray(parsed.data) ? parsed.data : [];

    if (columns.length === 0 || rows.length === 0) {
      return { columns, rows, equitySeries: [] };
    }

    const lower = columns.map((c) => c.toLowerCase());
    const timeIndex = lower.findIndex((c) =>
      ['date', 'datetime', 'timestamp', 'time'].includes(c)
    );
    const equityIndex = lower.findIndex((c) =>
      ['equity', 'equity_curve', 'portfolio_value', 'balance'].includes(c)
    );

    const timeKey = timeIndex !== -1 ? columns[timeIndex] : columns[0];
    const equityKey = equityIndex !== -1 ? columns[equityIndex] : columns[columns.length - 1];

    const equitySeries = rows.map((row, index) => ({
      label: row[timeKey] ?? index + 1,
      equity: Number(row[equityKey]) || 0
    }));

    return { columns, rows, equitySeries };
  };

  const handleRunBacktest = async () => {
    setIsRunning(true);
    setBacktestError(null);

    try {
      const payload = uploadedFilename ? { filename: uploadedFilename } : {};
      const metricsResponse = await runBacktest(payload);
      const extractedMetrics = metricsResponse?.metrics || metricsResponse;
      setMetrics(extractedMetrics);

      const csvResponse = await fetchResultsCsv();
      const csvText = typeof csvResponse === 'string' ? csvResponse : csvResponse?.data || '';
      const { columns, rows, equitySeries: series } = parseBacktestCsv(csvText);

      setResultsColumns(columns);
      setResultsRows(rows);
      setEquitySeries(series);
      setLastRunAt(new Date());
    } catch (error) {
      console.error(error);
      setBacktestError(
        'Failed to run backtest or load results. Please ensure the backend is running and try again.'
      );
    } finally {
      setIsRunning(false);
    }
  };

  const handleLogout = () => {
    googleLogout();
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="bg-grid pointer-events-none fixed inset-0 opacity-40" aria-hidden="true" />
      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="border-b border-slate-800/60 bg-slate-950/80 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-slate-50">
                AlgoNexus — Algorithmic Trading Backtesting Platform
              </h1>
              <p className="text-xs text-slate-500">
                Upload historical data, design algorithmic strategies, and evaluate performance.
              </p>
            </div>
            <div className="flex items-center gap-4">
              {isAuthLoading ? (
                <div className="text-xs text-slate-400">Loading...</div>
              ) : user ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {user.picture && <img src={user.picture} alt="Profile" className="h-8 w-8 rounded-full" />}
                    <span className="text-sm font-medium">{user.name}</span>
                  </div>
                  <button onClick={handleLogout} className="btn-neon px-4 py-2 text-xs">
                    Logout
                  </button>
                </div>
              ) : (
                <div id="google-login-btn">
                  <GoogleLogin
                    onSuccess={async (credentialResponse) => {
                      setIsAuthLoading(true);
                      try {
                        const { user, token } = await backendGoogleLogin(credentialResponse.credential);
                        localStorage.setItem('token', token);
                        setUser(user);
                      } catch (err) {
                        console.error('Login failed', err);
                      } finally {
                        setIsAuthLoading(false);
                      }
                    }}
                    onError={() => {
                      console.error('Google Login Failed');
                    }}
                    theme="filled_black"
                    shape="pill"
                  />
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-6 py-8 pb-16">
          {!user ? (
            <div className="flex flex-col gap-12">
              <div className="glass-card flex min-h-[400px] flex-col items-center justify-center rounded-2xl p-8 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500/20 to-neon-cyan/20 text-brand-400">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white">Authentication Required</h2>
                <p className="mt-2 text-slate-400">Please sign in with Google to access the backtesting platform.</p>
              </div>
              <TutorialManual />
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2">
                <UploadCard onUploadSuccess={(res) => setUploadedFilename(res.file)} />
                <StrategyCard />
              </div>

              <RunBacktest
                onRunBacktest={handleRunBacktest}
                isRunning={isRunning}
                error={backtestError}
                lastRunAt={lastRunAt}
              />

              <Metrics metrics={metrics} />

              <EquityChart data={equitySeries} />

              <DataTable columns={resultsColumns} rows={resultsRows} />
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;

