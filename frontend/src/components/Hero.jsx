import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative overflow-hidden pt-24 pb-32 sm:pt-32 sm:pb-40">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -ml-[30rem] -mt-20 h-[40rem] w-[60rem] rounded-full bg-gradient-to-br from-brand-600/30 to-neon-cyan/20 blur-3xl opacity-50 pointer-events-none" />
      
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8 text-center">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl mb-6">
            Algorithmic Trading Platform for <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-brand-400">Modern Quants</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-400 sm:text-xl max-w-2xl mx-auto">
            Design strategies, run institutional-grade backtests, analyze performance metrics, and deploy your trading ideas—all without leaving the browser.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link to="/signup" className="btn-neon text-lg px-8 py-3.5 shadow-brand-500/20 shadow-lg">
              Start Backtesting
            </Link>
            <a href="#features" className="text-sm font-semibold leading-6 text-white hover:text-neon-cyan transition-colors group">
              View Demo <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
