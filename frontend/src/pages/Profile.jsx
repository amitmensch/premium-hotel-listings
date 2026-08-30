import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) setFormData({ name: user.name, email: user.email });
  }, [user]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await api.patch('/users/profile', formData);
      if (typeof setUser === 'function') {
        const updatedUser = res.data.data?.user || res.data.user;
        setUser(updatedUser);
      }
      setMessage({ type: 'success', text: 'Profile updated.' });
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update profile.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you absolutely sure? All bookings, properties, and reviews will be permanently deleted. This cannot be undone.'
    );
    if (confirmed) {
      try {
        await api.delete('/users/account');
        setUser(null);
        navigate('/');
      } catch (err) {
        alert('Failed to delete account. Please try again.');
      }
    }
  };

  if (!user) return null;

  return (
    <div className="container-page mx-auto max-w-xl py-12 lg:py-16">
      <p className="eyebrow">Account</p>
      <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-ink-900">
        My profile
      </h1>

      <div className="card mt-10 p-6 sm:p-8">
        {message.text && (
          <div
            className={`mb-6 rounded-lg border px-4 py-3 text-sm ${
              message.type === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : 'border-red-200 bg-red-50 text-red-700'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="label">Full name</label>
            <input type="text" name="name" value={formData.name} required onChange={handleChange} className="input" />
          </div>
          <div>
            <label className="label">Email address</label>
            <input type="email" name="email" value={formData.email} required onChange={handleChange} className="input" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Saving…' : 'Update profile'}
          </button>
        </form>

        <div className="mt-10 border-t border-ink-100 pt-8">
          <h2 className="font-serif text-xl font-semibold text-red-600">Danger zone</h2>
          <p className="mt-1 text-sm text-ink-500">
            Deleting your account is permanent and cannot be undone.
          </p>
          <button
            onClick={handleDeleteAccount}
            className="mt-5 rounded-lg border border-red-200 bg-white px-5 py-2.5 text-sm font-medium tracking-wide text-red-600 transition-colors hover:bg-red-500 hover:text-white"
          >
            Delete account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;