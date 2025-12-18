import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function Auth() {
  const navigate = useNavigate();

  const [mode, setMode] = React.useState('login'); // 'login' | 'signup'
  const isLogin = mode === 'login';

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const handleAuth = async e => {
    e.preventDefault();
    setError(null);

    if (!supabase) {
      setError('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
      return;
    }

    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);

      // Login -> signInWithPassword
      if (isLogin) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password
        });
        if (signInError) throw signInError;
      } else {
        // Sign up -> signUp
        const { error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password
        });
        if (signUpError) throw signUpError;
      }

      navigate('/');
    } catch (err) {
      // Supabase errors usually have `message`
      setError(err?.message ?? 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-7rem)] flex items-center justify-center py-10">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-white/15 bg-white/10 p-6 shadow-soft-2xl backdrop-blur-xl sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Land Leverage
              </p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                {isLogin ? 'Welcome back' : 'Create your account'}
              </h1>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                {isLogin ? 'Sign in to continue.' : 'Sign up to start exploring deals.'}
              </p>
            </div>

            <div className="inline-flex rounded-full bg-white/10 p-1 ring-1 ring-white/15">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  isLogin
                    ? 'bg-white/20 text-slate-900 dark:text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-white/10'
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  !isLogin
                    ? 'bg-white/20 text-slate-900 dark:text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-white/10'
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>

          <form onSubmit={handleAuth} className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Email</label>
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-500 ring-1 ring-white/10 backdrop-blur focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Password</label>
              <input
                type="password"
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-500 ring-1 ring-white/10 backdrop-blur focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
                placeholder="••••••••"
              />
            </div>

            {!isLogin && (
              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  Confirm password
                </label>
                <input
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-500 ring-1 ring-white/10 backdrop-blur focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
                  placeholder="••••••••"
                />
              </div>
            )}

            {error && (
              <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-100">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-500 to-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 shadow-md shadow-emerald-500/30 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (isLogin ? 'Signing in…' : 'Creating account…') : isLogin ? 'Sign In' : 'Sign Up'}
            </button>

            <div className="flex items-center justify-between pt-1 text-xs text-slate-500">
              <Link to="/" className="hover:text-slate-700 dark:hover:text-slate-300">
                ← Back home
              </Link>
              <button
                type="button"
                onClick={() => setMode(isLogin ? 'signup' : 'login')}
                className="text-emerald-300 hover:text-emerald-200"
              >
                {isLogin ? 'Need an account?' : 'Already have an account?'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


