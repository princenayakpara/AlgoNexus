const DataTable = ({ columns, rows }) => {
  const hasData = Array.isArray(columns) && columns.length > 0 && Array.isArray(rows) && rows.length > 0;

  const formatCell = (value, colName) => {
    if (value == null) return '—';
    const num = Number(value);
    if (!isNaN(num) && colName.toLowerCase() !== 'date' && colName.toLowerCase() !== 'datetime') {
      if (Math.abs(num) >= 1000) return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
      if (Math.abs(num) < 1) return num.toFixed(4);
      return num.toFixed(2);
    }
    return String(value);
  };

  return (
    <section className="glass-card rounded-2xl p-6 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-neon-cyan/20 to-brand-500/20 text-neon-cyan">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Backtest Data
            </h2>
            <p className="text-xs text-slate-500">
              Bar-by-bar results from the backtest engine
            </p>
          </div>
        </div>

        {hasData && (
          <span className="rounded-lg border border-slate-700/40 bg-navy-900/60 px-3 py-1.5 font-mono text-[11px] text-slate-400">
            {rows.length} rows × {columns.length} cols
          </span>
        )}
      </div>

      {/* Table */}
      {!hasData ? (
        <div className="flex h-40 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-700/40 bg-navy-900/30">
          <svg className="h-10 w-10 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <p className="text-xs text-slate-600">
            Results table will populate after a successful backtest
          </p>
        </div>
      ) : (
        <div className="max-h-[420px] overflow-auto rounded-xl border border-slate-700/30 bg-navy-950/60">
          <table className="min-w-full border-collapse">
            <thead className="sticky top-0 z-10 bg-navy-900/95 backdrop-blur-sm">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column}
                    className="border-b border-slate-700/40 px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr
                  key={index}
                  className={`border-b border-slate-800/30 transition-colors hover:bg-brand-500/5 ${
                    index % 2 === 0 ? 'bg-navy-950/30' : 'bg-navy-900/20'
                  }`}
                >
                  {columns.map((column) => (
                    <td
                      key={column}
                      className="whitespace-nowrap px-4 py-2.5 font-mono text-xs text-slate-300"
                    >
                      {formatCell(row[column], column)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default DataTable;
