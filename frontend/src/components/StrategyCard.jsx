import { useState } from 'react';
import { createStrategy } from '../services/api.js';

const StrategyCard = () => {
  const [name, setName] = useState('');
  const [rule, setRule] = useState('');
  const [indicator1, setIndicator1] = useState('SMA');
  const [indicator1Period, setIndicator1Period] = useState(5);
  const [indicator2, setIndicator2] = useState('SMA');
  const [indicator2Period, setIndicator2Period] = useState(15);
  const [crossoverDirection, setCrossoverDirection] = useState('above');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!name.trim() || !rule.trim()) {
      setError('Both strategy name and rule are required.');
      return;
    }
    setIsSaving(true);
    setMessage(null);
    setError(null);

    try {
      const payload = {
        name: name.trim(),
        rule: rule.trim(),
        config: {
          type: 'CROSSOVER',
          indicator1: { type: indicator1, period: Number(indicator1Period) || 20, source: 'close' },
          indicator2: { type: indicator2, period: Number(indicator2Period) || 50, source: 'close' },
          direction: crossoverDirection
        }
      };
      await createStrategy(payload);
      setMessage(`✓ Strategy "${name}" created successfully`);
    } catch (err) {
      console.error(err);
      setError('Failed to create strategy. Please check the backend.');
    } finally {
      setIsSaving(false);
    }
  };

  const presets = [
    {
      name: 'SMA Crossover',
      rule: 'BUY when SMA5 crosses above SMA15, SELL when SMA5 crosses below SMA15',
      config: {
        type: 'CROSSOVER',
        indicator1: { type: 'SMA', period: 5, source: 'close' },
        indicator2: { type: 'SMA', period: 15, source: 'close' },
        direction: 'above'
      }
    },
    {
      name: 'RSI Reversal',
      rule: 'BUY when RSI14 < 30, SELL when RSI14 > 70',
      config: {
        type: 'THRESHOLD',
        indicator1: { type: 'RSI', period: 14, source: 'close' },
        buy: { operator: '<', level: 30 },
        sell: { operator: '>', level: 70 }
      }
    },
    {
      name: 'Bollinger Breakout',
      rule: 'BUY when close breaks above upper Bollinger band, SELL when close falls back inside band',
      config: {
        type: 'BOLLINGER_BREAKOUT',
        indicator1: { type: 'BOLLINGER', period: 20, stdDev: 2, source: 'close' }
      }
    }
  ];

  return (
    <section className="glass-card rounded-2xl p-6 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
      {/* Header */}
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500/20 to-neon-purple/20 text-brand-400">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            Strategy Designer
          </h2>
          <p className="text-xs text-slate-500">
            Define entry and exit logic in plain English or pseudo-code
          </p>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="mb-4 flex flex-wrap gap-2">
        {presets.map((preset) => (
          <button
            key={preset.name}
            type="button"
            onClick={() => {
              setName(preset.name);
              setRule(preset.rule);
              if (preset.config?.indicator1) {
                setIndicator1(preset.config.indicator1.type || 'SMA');
                if (preset.config.indicator1.period) {
                  setIndicator1Period(preset.config.indicator1.period);
                }
              }
              if (preset.config?.indicator2) {
                setIndicator2(preset.config.indicator2.type || 'SMA');
                if (preset.config.indicator2.period) {
                  setIndicator2Period(preset.config.indicator2.period);
                }
              }
              if (preset.config?.direction) {
                setCrossoverDirection(preset.config.direction);
              }
              setMessage(null);
              setError(null);
            }}
            className="rounded-lg border border-slate-700/50 bg-navy-900/60 px-3 py-1.5 text-[11px] font-medium text-slate-400 transition-all hover:border-brand-500/40 hover:text-brand-400"
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* Visual Builder */}
      <div className="mb-4 grid gap-4 rounded-2xl border border-slate-800/60 bg-navy-900/40 p-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Indicator 1
            </label>
            <div className="flex items-center gap-2">
              <select
                value={indicator1}
                onChange={(e) => setIndicator1(e.target.value)}
                className="w-24 rounded-lg border border-slate-700/60 bg-navy-900/60 px-2 py-1.5 text-[11px] text-slate-100 outline-none focus:border-brand-500/60"
              >
                <option value="SMA">SMA</option>
                <option value="EMA">EMA</option>
                <option value="RSI">RSI</option>
                <option value="MACD">MACD</option>
                <option value="BOLLINGER">Bollinger</option>
                <option value="VWAP">VWAP</option>
              </select>
              <span className="text-[11px] text-slate-500">Period</span>
              <input
                type="number"
                min={1}
                value={indicator1Period}
                onChange={(e) => setIndicator1Period(e.target.value)}
                className="w-16 rounded-lg border border-slate-700/60 bg-navy-900/60 px-2 py-1.5 text-[11px] text-slate-100 outline-none focus:border-brand-500/60"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Indicator 2
            </label>
            <div className="flex items-center gap-2">
              <select
                value={indicator2}
                onChange={(e) => setIndicator2(e.target.value)}
                className="w-24 rounded-lg border border-slate-700/60 bg-navy-900/60 px-2 py-1.5 text-[11px] text-slate-100 outline-none focus:border-brand-500/60"
              >
                <option value="SMA">SMA</option>
                <option value="EMA">EMA</option>
                <option value="RSI">RSI</option>
                <option value="MACD">MACD</option>
                <option value="BOLLINGER">Bollinger</option>
                <option value="VWAP">VWAP</option>
              </select>
              <span className="text-[11px] text-slate-500">Period</span>
              <input
                type="number"
                min={1}
                value={indicator2Period}
                onChange={(e) => setIndicator2Period(e.target.value)}
                className="w-16 rounded-lg border border-slate-700/60 bg-navy-900/60 px-2 py-1.5 text-[11px] text-slate-100 outline-none focus:border-brand-500/60"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Rule Type
            </label>
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
              <span className="rounded-full bg-navy-900/80 px-2 py-1 font-mono">
                BUY when {indicator1}
                {indicator1Period} crosses
              </span>
              <select
                value={crossoverDirection}
                onChange={(e) => setCrossoverDirection(e.target.value)}
                className="rounded-lg border border-slate-700/60 bg-navy-900/60 px-2 py-1.5 text-[11px] text-slate-100 outline-none focus:border-brand-500/60"
              >
                <option value="above">above</option>
                <option value="below">below</option>
              </select>
              <span className="rounded-full bg-navy-900/80 px-2 py-1 font-mono">
                {indicator2}
                {indicator2Period}
              </span>
            </div>
          </div>

          <div className="text-[11px] text-slate-500">
            <div className="mb-1 font-semibold uppercase tracking-wider">
              Generated Rule
            </div>
            <div className="rounded-lg border border-dashed border-slate-700/60 bg-navy-900/60 px-3 py-2 font-mono text-[11px] text-slate-300">
              BUY when {indicator1}
              {indicator1Period} crosses {crossoverDirection} {indicator2}
              {indicator2Period}. SELL when {indicator1}
              {indicator1Period} crosses {crossoverDirection === 'above' ? 'below' : 'above'}{' '}
              {indicator2}
              {indicator2Period}.
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Strategy Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-slate-700/50 bg-navy-900/60 px-4 py-2.5 font-mono text-sm text-white outline-none transition-all placeholder:text-slate-600 focus:border-brand-500/60"
            placeholder="e.g. SMA Crossover"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Strategy Rule
          </label>
          <textarea
            value={rule}
            onChange={(e) => setRule(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-slate-700/50 bg-navy-900/60 px-4 py-2.5 font-mono text-sm text-white outline-none transition-all placeholder:text-slate-600 focus:border-brand-500/60"
            placeholder="e.g. BUY when close > SMA20, SELL when close < SMA20"
          />
        </div>

        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="text-xs">
            {message && (
              <p className="flex items-center gap-1.5 text-neon-green">
                <span className="status-dot bg-neon-green shadow-[0_0_6px_rgba(0,255,136,0.5)]" />
                {message}
              </p>
            )}
            {error && (
              <p className="flex items-center gap-1.5 text-rose-400">
                <span className="status-dot bg-rose-400" />
                {error}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSaving}
            className="btn-gradient px-5 py-2.5 text-xs"
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Saving…
              </span>
            ) : (
              'Create Strategy'
            )}
          </button>
        </div>
      </form>
    </section>
  );
};

export default StrategyCard;
