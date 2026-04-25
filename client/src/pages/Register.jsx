import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import useAuth from '../hooks/useAuth';
import { toast } from 'react-hot-toast';
import ErrorMessage from '../components/ErrorMessage';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.post('/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      
      login(res.data.user, res.data.token);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 border border-ink/5 slide-up">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-serif font-black text-ink mb-2">Create Account</h1>
          <p className="text-ink/60 font-medium">Join our community of creators</p>
        </div>

        {error && <ErrorMessage message={error} />}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-ink mb-2">Username</label>
            <input
              type="text"
              name="username"
              required
              value={formData.username}
              onChange={handleChange}
              className="w-full px-5 py-4 bg-cream/50 border border-ink/10 rounded-2xl focus:ring-2 focus:ring-amber focus:border-transparent outline-none transition-all text-ink"
              placeholder="johndoe"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-ink mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-5 py-4 bg-cream/50 border border-ink/10 rounded-2xl focus:ring-2 focus:ring-amber focus:border-transparent outline-none transition-all text-ink"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-ink mb-2">Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-5 py-4 bg-cream/50 border border-ink/10 rounded-2xl focus:ring-2 focus:ring-amber focus:border-transparent outline-none transition-all text-ink"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-ink mb-2">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-5 py-4 bg-cream/50 border border-ink/10 rounded-2xl focus:ring-2 focus:ring-amber focus:border-transparent outline-none transition-all text-ink"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber text-ink py-4 rounded-2xl font-bold hover:bg-amber/90 transition-all disabled:opacity-50 shadow-xl shadow-amber/20 mt-4"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          <span className="text-ink/50">Already have an account? </span>
          <Link to="/login" className="text-ink font-bold hover:underline">Sign in instead</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
