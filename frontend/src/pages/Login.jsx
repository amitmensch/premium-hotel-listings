import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to log in. Please try again.');
    }
  };

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <div className="card w-full max-w-md p-8 sm:p-10">
        <p className="eyebrow">Welcome back</p>
        <h1 className="mt-3 font-serif text-4xl font-semibold text-ink-900">Sign in</h1>
        <p className="mt-2 text-sm text-ink-500">Access your trips, bookings, and listings.</p>

        {error && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className="label">Email address</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label htmlFor="password" className="label">Password</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
            />
          </div>
          <button type="submit" className="btn-primary w-full">Sign in</button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-500">
          New to PremiumStays?{' '}
          <Link
            to="/register"
            className="font-medium text-ink-900 underline decoration-brand-400 decoration-2 underline-offset-4 transition-colors hover:text-brand-600"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;