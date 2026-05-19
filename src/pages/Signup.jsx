import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Signup() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/signup', form);
      login(res.data.token, res.data.user);
      navigate('/', { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message || 'Signup failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center px-4">
      <div className="w-full max-w-sm animate-fade-in">
        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-1.5">Create account</h1>
          <p className="text-gray-500 text-sm">
            Join to access premium career content
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="card space-y-4" noValidate>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5" htmlFor="name">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
              autoComplete="name"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              autoComplete="email"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Min. 6 characters with a number"
              required
              autoComplete="new-password"
              className="input-field"
            />
          </div>

          {error && (
            <div
              role="alert"
              className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                Creating account...
              </span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-white hover:underline underline-offset-2">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
