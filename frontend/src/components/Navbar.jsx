import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800/60 bg-slate-950/80 px-6 py-4 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-xl font-bold tracking-tight text-white hover:text-neon-cyan transition-colors">
            AlgoNexus
          </Link>
          <div className="hidden md:flex gap-6 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#markets" className="hover:text-white transition-colors">Markets</a>
            <a href="#docs" className="hover:text-white transition-colors">Docs</a>
            <a href="https://github.com/princenayakpara/AlgoNexus" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="hidden sm:flex items-center gap-2">
                {user.picture ? (
                  <img src={user.picture} alt="Profile" className="h-8 w-8 rounded-full" />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-brand-500 flex items-center justify-center text-sm font-bold text-white uppercase">
                    {user.name?.charAt(0) || 'U'}
                  </div>
                )}
                <span className="text-sm font-medium text-slate-300">{user.name}</span>
              </div>
              <Link to="/dashboard" className="text-sm font-semibold text-white hover:text-brand-400 transition-colors">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="btn-neon px-4 py-2 text-xs">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link to="/signup" className="btn-brand px-5 py-2.5 text-sm font-semibold">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
