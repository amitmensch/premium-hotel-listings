import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' });
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <div className="card w-full max-w-md p-8 sm:p-10">
        <p className="eyebrow">Join PremiumStays</p>
        <h1 className="mt-3 font-serif text-4xl font-semibold text-ink-900">Create account</h1>
        <p className="mt-2 text-sm text-ink-500">Start booking or hosting premium stays.</p>

        {error && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="name" className="label">Full name</label>
            <input id="name" type="text" name="name" required onChange={handleChange} className="input" />
          </div>
          <div>
            <label htmlFor="reg-email" className="label">Email address</label>
            <input id="reg-email" type="email" name="email" required onChange={handleChange} className="input" />
          </div>
          <div>
            <label htmlFor="reg-password" className="label">
              Password <span className="normal-case tracking-normal text-ink-400">(min 8 characters)</span>
            </label>
            <input
              id="reg-password"
              type="password"
              name="password"
              required
              minLength="8"
              onChange={handleChange}
              className="input"
            />
          </div>
          <div>
            <label htmlFor="role" className="label">I want to…</label>
            <select id="role" name="role" onChange={handleChange} className="input">
              <option value="user">Book stays (Guest)</option>
              <option value="host">List my properties (Host)</option>
            </select>
          </div>
          <button type="submit" className="btn-primary w-full">Sign up</button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-500">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-ink-900 underline decoration-brand-400 decoration-2 underline-offset-4 transition-colors hover:text-brand-600"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;