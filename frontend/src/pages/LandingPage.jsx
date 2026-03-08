import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import TutorialManual from '../components/TutorialManual';
import Footer from '../components/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <div className="bg-grid pointer-events-none fixed inset-0 opacity-40" aria-hidden="true" />
      <div className="relative z-10 flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Hero />
          <Features />
          <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32 border-t border-slate-800/60">
            <TutorialManual />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;
