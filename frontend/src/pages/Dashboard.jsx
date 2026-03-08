import React, { useState } from 'react';
import Papa from 'papaparse';
import Navbar from '../components/Navbar';
import UploadCard from '../components/UploadCard';
import StrategyCard from '../components/StrategyCard';
import RunBacktest from '../components/RunBacktest';
import Metrics from '../components/Metrics';
import EquityChart from '../components/EquityChart';
import DataTable from '../components/DataTable';
import { runBacktest, fetchResultsCsv } from '../services/api';

const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [equitySeries, setEquitySeries] = useState([]);
  const [resultsColumns, setResultsColumns] = useState([]);
  const [resultsRows, setResultsRows] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [backtestError, setBacktestError] = useState(null);
  const [lastRunAt, setLastRunAt] = useState(null);
  const [uploadedFilename, setUploadedFilename] = useState(null);

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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <div className="bg-grid pointer-events-none fixed inset-0 opacity-40" aria-hidden="true" />
      <div className="relative z-10 flex-1 flex flex-col">
        <Navbar />

        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-6 py-8 pb-16">
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
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
