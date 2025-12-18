import React, { useState, FormEvent } from 'react';
import { createClient, AuthError } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const Auth = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleAuth = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        if (password !== confirmPassword) {
          alert('Passwords do not match');
          setLoading(false);
          return;
        }
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
      }
      navigate('/');
    } catch (error) {
      if (error instanceof AuthError) {
        alert(error.message);
      } else if (error instanceof Error) {
        alert(error.message);
      } else {
        alert(String(error));
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 bg-opacity-30 backdrop-blur-md p-8 rounded-lg shadow-lg border border-white border-opacity-20 w-full max-w-md">
        <h2 className="text-white text-3xl font-bold text-center mb-6">
          {isLogin ? 'Login' : 'Create Account'}
        </h2>
        <form onSubmit={handleAuth}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-300 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline bg-gray-900"
              placeholder="Email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-300 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 text-gray-200 mb-3 leading-tight focus:outline-none focus:shadow-outline bg-gray-900"
              placeholder="********"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              required
            />
          </div>
          {!isLogin && (
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-gray-300 text-sm font-bold mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 text-gray-200 mb-3 leading-tight focus:outline-none focus:shadow-outline bg-gray-900"
                placeholder="********"
                value={confirmPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}
          <button
            type="submit"
            className={`w-full bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-500 hover:to-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200 ease-in-out transform hover:-translate-y-1 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isLogin ? 'Logging In...' : 'Signing Up...'}
              </span>
            ) : (
              isLogin ? 'Sign In' : 'Sign Up'
            )}
          </button>
        </form>
        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-gray-400 hover:text-white text-sm"
          >
            {isLogin
              ? 'Need an account? Create one'
              : 'Already have an account? Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
