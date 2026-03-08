const METRIC_CONFIG = [
  {
    key: 'totalReturn',
    label: 'Total Return',
    format: (v) => (typeof v === 'number' ? `${v >= 0 ? '+' : ''}${v.toFixed(2)}%` : v ?? '—'),
    color: 'from-neon-green/10 to-neon-cyan/5',
    accent: 'text-neon-green',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    )
  },
  {
    key: 'sharpeRatio',
    label: 'Sharpe Ratio',
    format: (v) => (typeof v === 'number' ? v.toFixed(3) : v ?? '—'),
    color: 'from-brand-500/10 to-neon-purple/5',
    accent: 'text-brand-400',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  },
  {
    key: 'maxDrawdown',
    label: 'Max Drawdown',
    format: (v) => (typeof v === 'number' ? `${v.toFixed(2)}%` : v ?? '—'),
    color: 'from-rose-500/10 to-rose-600/5',
    accent: 'text-rose-400',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
      </svg>
    )
  },
  {
    key: 'finalValue',
    label: 'Final Equity',
    format: (v) => (typeof v === 'number' ? `$${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : v ?? '—'),
    color: 'from-neon-cyan/10 to-neon-blue/5',
    accent: 'text-neon-cyan',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  }
];

const Metrics = ({ metrics }) => {
  // Extract value by key — supports camelCase from API and snake_case fallback
  const getValue = (key) => {
    if (!metrics || typeof metrics !== 'object') return undefined;

    // Direct match (camelCase from API)
    if (metrics[key] !== undefined) return metrics[key];

    // Try snake_case → camelCase conversion
    const camel = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    if (metrics[camel] !== undefined) return metrics[camel];

    // Try camelCase → snake_case conversion
    const snake = key.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
    if (metrics[snake] !== undefined) return metrics[snake];

    // Fuzzy match: strip all underscores/spaces, compare lowercase
    const entries = Object.entries(metrics);
    const normalizedKey = key.toLowerCase().replace(/[_\s]/g, '');
    for (const [k, v] of entries) {
      if (k.toLowerCase().replace(/[_\s]/g, '') === normalizedKey) return v;
    }

    return undefined;
  };

  const hasMetrics = metrics && typeof metrics === 'object' && Object.keys(metrics).length > 0;

  return (
    <section className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-neon-green/20 to-brand-500/20 text-neon-green">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            Performance Metrics
          </h2>
        </div>
        
        {hasMetrics && (
          <a
            href={`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/results/report.pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex flex-shrink-0 items-center gap-2 rounded-lg bg-slate-800/50 px-4 py-2 hover:bg-slate-700/50"
          >
            <svg className="h-5 w-5 text-neon-cyan transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span className="text-xs font-semibold text-slate-300">Download Report</span>
          </a>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {METRIC_CONFIG.map((metric, index) => {
          const value = getValue(metric.key);
          const displayValue = hasMetrics ? metric.format(value) : '—';
          
          let valueColor = 'text-slate-600';
          if (hasMetrics) {
            if (typeof value === 'number') {
              if (value > 0) valueColor = 'text-neon-green';
              else if (value < 0) valueColor = 'text-rose-400';
              else valueColor = 'text-white';
            } else {
              valueColor = metric.accent;
            }
          }

          return (
            <div
              key={metric.key}
              className="metric-card rounded-2xl p-5"
              style={{ animationDelay: `${0.3 + index * 0.1}s` }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  {metric.label}
                </span>
                <div className={`rounded-lg bg-gradient-to-br ${metric.color} p-2 ${metric.accent}`}>
                  {metric.icon}
                </div>
              </div>
              <div className="mt-3">
                <span className={`text-2xl font-extrabold tracking-tight ${valueColor}`}>
                  {displayValue}
                </span>
              </div>
              {!hasMetrics && (
                <p className="mt-2 text-[10px] text-slate-600">
                  Run a backtest to see results
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Metrics;
