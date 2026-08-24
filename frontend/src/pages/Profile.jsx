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
    if (user) {
      setFormData({ name: user.name, email: user.email });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await api.patch('/users/profile', formData);

      // Debugging log to see the exact response structure
      console.log("API Response:", res);

      // Check if setUser exists before calling it to prevent crashes
      if (typeof setUser === 'function') {
        // Fallback checks just in case the backend JSend structure varies
        const updatedUser = res.data.data?.user || res.data.user;
        setUser(updatedUser);
      } else {
        console.warn("setUser is not provided by AuthContext. Cannot update state dynamically.");
      }

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      console.error("Profile update error:", err);
      // Print the actual JS error to the screen if it's not an API error
      setMessage({
        type: 'error',
        text: err.response?.data?.message || err.message || 'Failed to update profile.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you absolutely sure you want to delete your account? All your bookings, properties, and reviews will be permanently deleted. This cannot be undone."
    );

    if (confirmDelete) {
      try {
        await api.delete('/users/account');
        setUser(null); // Clear global user state
        navigate('/'); // Redirect to the home page
      } catch (err) {
        alert('Failed to delete account. Please try again.');
      }
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">My Profile</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">

        {message.text && (
          <div className={`mb-4 p-4 rounded-lg font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              required
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              required
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-70 transition-colors"
          >
            {loading ? 'Saving...' : 'Update Profile'}
          </button>
        </form>

        {/* Danger Zone */}
        <hr className="my-8 border-gray-200" />

        <div>
          <h2 className="text-lg font-bold text-red-600 mb-2">Danger Zone</h2>
          <p className="text-sm text-gray-500 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button
            onClick={handleDeleteAccount}
            className="px-6 py-2 bg-red-50 text-red-600 font-bold rounded-lg border border-red-100 hover:bg-red-600 hover:text-white transition-colors"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
