import React from 'react';
import step1Img from '../assets/manual_step1_upload_1772988014497.png';
import step2Img from '../assets/manual_step2_strategy_1772988144049.png';
import step3Img from '../assets/manual_step3_run_1772988315474.png';
import step4Img from '../assets/manual_step4_analyze_1772988432453.png';

const steps = [
  {
    title: "1. Upload Historical Data",
    description: "Drag and drop your historical market data. We support CSV files and can automatically parse data tables from PDF documents.",
    image: step1Img,
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
    )
  },
  {
    title: "2. Define Your Strategy",
    description: "Select predefined algorithmic strategies like SMA Crossover or RSI Reversal, and tweak the parameters (e.g., Short/Long windows) to fit your thesis.",
    image: step2Img,
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  },
  {
    title: "3. Run the Backtest",
    description: "Launch our high-performance Python Pandas engine. It simulates chronologically through your historical data and executes trades based on your strategy.",
    image: step3Img,
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    title: "4. Analyze Performance",
    description: "Instantly visualize your portfolio's equity curve, analyze bar-by-bar execution tables, and download actionable PDF reports.",
    image: step4Img,
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
      </svg>
    )
  }
];

const TutorialManual = () => {
  return (
    <div className="mt-12 flex flex-col gap-16">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">How AlgoNexus Works</h2>
        <p className="mt-4 text-lg text-slate-400">
          A seamless transition from raw data to actionable trading alpha.
        </p>
      </div>

      <div className="flex flex-col gap-24">
        {steps.map((step, index) => (
          <div 
            key={index} 
            className={`flex flex-col items-center gap-12 lg:flex-row ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
          >
            <div className="flex-1 space-y-6">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/20 to-neon-cyan/20 text-brand-400">
                {step.icon}
              </div>
              <h3 className="text-2xl font-bold text-white">{step.title}</h3>
              <p className="text-lg leading-relaxed text-slate-400">
                {step.description}
              </p>
            </div>
            <div className="relative flex-1">
              <div className="overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-900/50 p-2 shadow-2xl ring-1 ring-white/10 backdrop-blur-sm">
                <img 
                  src={step.image} 
                  alt={step.title} 
                  className="w-full rounded-xl object-cover shadow-2xl"
                />
              </div>
              {/* Decorative background glow */}
              <div className="absolute -inset-0.5 -z-10 rounded-2xl bg-gradient-to-br from-brand-500/30 to-neon-cyan/30 opacity-20 blur-2xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TutorialManual;
