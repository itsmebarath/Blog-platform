import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axios';
import useAuth from '../hooks/useAuth';
import { toast } from 'react-hot-toast';
import ErrorMessage from '../components/ErrorMessage';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.user, res.data.token);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 border border-ink/5 slide-up">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-serif font-black text-ink mb-2">Welcome Back</h1>
          <p className="text-ink/60 font-medium">Log in to your premium account</p>
        </div>

        {error && <ErrorMessage message={error} />}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-ink mb-2">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 bg-cream/50 border border-ink/10 rounded-2xl focus:ring-2 focus:ring-amber focus:border-transparent outline-none transition-all text-ink"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-ink mb-2">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 bg-cream/50 border border-ink/10 rounded-2xl focus:ring-2 focus:ring-amber focus:border-transparent outline-none transition-all text-ink"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ink text-cream py-4 rounded-2xl font-bold hover:bg-ink/90 transition-all disabled:opacity-50 shadow-xl shadow-ink/20 mt-4"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          <span className="text-ink/50">Don't have an account? </span>
          <Link to="/register" className="text-amber font-bold hover:underline">Create one for free</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
