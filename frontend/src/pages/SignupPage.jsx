import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../auth/AuthContext';
import { register as backendRegister, googleLogin as googleBackendLogin } from '../services/api';
import Navbar from '../components/Navbar';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { user, token } = await backendRegister(name, email, password);
      login(token, user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to register. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');
    setIsLoading(true);
    try {
      const { user, token } = await googleBackendLogin(credentialResponse.credential);
      login(token, user);
      navigate('/dashboard');
    } catch (err) {
      setError('Google Sign-In failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <div className="bg-grid pointer-events-none fixed inset-0 opacity-40" aria-hidden="true" />
      <div className="relative z-10 flex-1 flex flex-col">
        <Navbar />
        
        <div className="flex-1 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
              Create an AlgoNexus Account
            </h2>
            <p className="mt-2 text-center text-sm text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-neon-cyan hover:text-brand-400">
                Sign in instead
              </Link>
            </p>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="glass-card py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-slate-700/50">
              
              <form className="space-y-6" onSubmit={handleRegister}>
                <div>
                  <label className="block text-sm font-medium text-slate-300">
                    Full Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full appearance-none rounded-lg border border-slate-700 bg-slate-900/50 px-3 py-2 placeholder-slate-500 shadow-sm focus:border-neon-cyan focus:outline-none focus:ring-1 focus:ring-neon-cyan sm:text-sm text-white"
                      placeholder="Jane Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300">
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full appearance-none rounded-lg border border-slate-700 bg-slate-900/50 px-3 py-2 placeholder-slate-500 shadow-sm focus:border-neon-cyan focus:outline-none focus:ring-1 focus:ring-neon-cyan sm:text-sm text-white"
                      placeholder="quant@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300">
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                      type="password"
                      required
                      value={password}
                      minLength={6}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full appearance-none rounded-lg border border-slate-700 bg-slate-900/50 px-3 py-2 placeholder-slate-500 shadow-sm focus:border-neon-cyan focus:outline-none focus:ring-1 focus:ring-neon-cyan sm:text-sm text-white"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {error && (
                  <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded-lg border border-red-500/20">
                    {error}
                  </div>
                )}

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-brand flex w-full justify-center px-4 py-2 text-sm disabled:opacity-50"
                  >
                    {isLoading ? 'Creating account...' : 'Create Account'}
                  </button>
                </div>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-700" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-[#0f172a] px-2 text-slate-400">Or continue with</span>
                  </div>
                </div>

                <div className="mt-6 flex justify-center w-full">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => setError('Google Sign-In Failed')}
                    theme="filled_black"
                    shape="pill"
                    width="100%"
                  />
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
