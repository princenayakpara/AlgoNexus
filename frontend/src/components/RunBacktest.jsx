const RunBacktest = ({ onRunBacktest, isRunning, error, lastRunAt }) => {
  return (
    <section className="glass-card rounded-2xl p-6 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Left — Info */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-neon-green/20 to-neon-cyan/20 text-neon-green">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Run Backtest
            </h2>
            <p className="text-xs text-slate-500">
              Execute strategy on uploaded dataset
            </p>
            {lastRunAt && (
              <p className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-600">
                <span className="status-dot bg-neon-green/50" />
                Last run: <span className="font-mono text-slate-400">{lastRunAt.toLocaleString()}</span>
              </p>
            )}
          </div>
        </div>

        {/* Right — Button */}
        <button
          type="button"
          onClick={onRunBacktest}
          disabled={isRunning}
          className={`group relative inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-navy-950 shadow-neon-strong transition-all duration-300 ${
            isRunning
              ? 'cursor-not-allowed bg-slate-700 text-slate-400 shadow-none'
              : 'bg-gradient-to-r from-neon-green via-neon-cyan to-neon-green bg-[length:200%_100%] hover:bg-right hover:shadow-[0_0_40px_rgba(0,255,136,0.3)]'
          }`}
        >
          {isRunning ? (
            <>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Running Backtest…
            </>
          ) : (
            <>
              <svg className="h-4 w-4 transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Run Backtest
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-rose-500/20 bg-rose-500/5 px-4 py-2.5">
          <p className="flex items-center gap-2 text-xs text-rose-400">
            <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {error}
          </p>
        </div>
      )}
    </section>
  );
};

export default RunBacktest;
