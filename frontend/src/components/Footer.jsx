import React from 'react';

const Footer = () => {
  return (
    <footer className="mt-24 border-t border-slate-800/60 bg-slate-950/80 backdrop-blur pb-8 pt-16 sm:pt-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8">
            <h2 className="text-2xl font-bold tracking-tight text-white">AlgoNexus</h2>
            <p className="text-sm leading-6 text-slate-400 max-w-xs">
              Build, Backtest, and Deploy Algorithmic Trading Strategies with institutional-grade tools directly in your browser.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">Platform</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li><a href="#" className="text-sm leading-6 text-slate-400 hover:text-white transition-colors">Features</a></li>
                  <li><a href="#" className="text-sm leading-6 text-slate-400 hover:text-white transition-colors">Strategy Builder</a></li>
                  <li><a href="#" className="text-sm leading-6 text-slate-400 hover:text-white transition-colors">Metrics</a></li>
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-white">Resources</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li><a href="#" className="text-sm leading-6 text-slate-400 hover:text-white transition-colors">Documentation</a></li>
                  <li><a href="#" className="text-sm leading-6 text-slate-400 hover:text-white transition-colors">API Reference</a></li>
                  <li><a href="#" className="text-sm leading-6 text-slate-400 hover:text-white transition-colors">Blog</a></li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">Company</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li><a href="#" className="text-sm leading-6 text-slate-400 hover:text-white transition-colors">About</a></li>
                  <li><a href="https://github.com/princenayakpara/AlgoNexus" className="text-sm leading-6 text-slate-400 hover:text-white transition-colors">GitHub</a></li>
                  <li><a href="#" className="text-sm leading-6 text-slate-400 hover:text-white transition-colors">Contact</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 border-t border-slate-800/60 pt-8 sm:mt-20 lg:mt-24 flex justify-between items-center">
          <p className="text-xs leading-5 text-slate-500">
            &copy; {new Date().getFullYear()} AlgoNexus, Inc. All rights reserved.
          </p>
          <p className="text-xs leading-5 text-slate-500">
            Designed for the Hackathon
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
