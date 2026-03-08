import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-brand-500/20 bg-navy-950/95 px-4 py-3 shadow-lg backdrop-blur-sm">
      <p className="mb-1 font-mono text-[11px] text-slate-400">{label}</p>
      <p className="font-mono text-sm font-bold text-neon-green">
        ${Number(payload[0].value).toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </p>
    </div>
  );
};

const EquityChart = ({ data }) => {
  const hasData = Array.isArray(data) && data.length > 0;

  return (
    <section className="glass-card rounded-2xl p-6 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-neon-green/20 to-neon-cyan/20 text-neon-green">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Equity Curve
            </h2>
            <p className="text-xs text-slate-500">
              Portfolio value over the backtest period
            </p>
          </div>
        </div>

        {hasData && (
          <div className="flex items-center gap-2 rounded-lg border border-neon-green/20 bg-neon-green/5 px-3 py-1.5">
            <span className="status-dot bg-neon-green shadow-[0_0_6px_rgba(0,255,136,0.5)]" />
            <span className="text-[11px] font-semibold text-neon-green">
              {data.length} data points
            </span>
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="relative">
        {!hasData ? (
          <div className="flex h-72 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-700/40 bg-navy-900/30">
            <svg className="h-12 w-12 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
            <p className="text-xs text-slate-600">
              Run a backtest to visualize the equity curve
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="equityFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00ff88" stopOpacity={0.25} />
                  <stop offset="50%" stopColor="#00ff88" stopOpacity={0.08} />
                  <stop offset="100%" stopColor="#00ff88" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="equityStroke" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#00ff88" />
                  <stop offset="50%" stopColor="#00d4ff" />
                  <stop offset="100%" stopColor="#00ff88" />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(99,102,241,0.08)"
                vertical={false}
              />
              <XAxis
                dataKey="label"
                tickLine={false}
                tickMargin={10}
                minTickGap={40}
                stroke="#334155"
                style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                stroke="#334155"
                style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                width={55}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="equity"
                stroke="url(#equityStroke)"
                strokeWidth={2.5}
                fill="url(#equityFill)"
                dot={false}
                activeDot={{
                  r: 5,
                  strokeWidth: 2,
                  stroke: '#00ff88',
                  fill: '#020617',
                  style: { filter: 'drop-shadow(0 0 6px rgba(0,255,136,0.5))' }
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
};

export default EquityChart;
