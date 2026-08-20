import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const HostDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    pricePerNight: '',
    address: '',
    city: '',
    state: '',
    country: '',
    amenities: 'Free WiFi, Air Conditioning'
  });
  const [images, setImages] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImages(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // NEW: Check image count before submitting
    if (images.length < 3 || images.length > 5) {
      setError('You must select between 3 and 5 images.');
      return;
    }

    setLoading(true);
    setError('');

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));

    for (let i = 0; i < images.length; i++) {
      data.append('images', images[i]);
    }

    try {
      const res = await api.post('/hotels', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate(`/hotels/${res.data.data.hotel._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create listing.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Host Dashboard</h1>
        <p className="mt-2 text-gray-600">Create a new property listing below.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
        {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Property Name</label>
              <input type="text" name="name" required onChange={handleChange} className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea name="description" rows="3" required onChange={handleChange} className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg"></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Price per Night (USD)</label>
              <input type="number" name="pricePerNight" min="1" required onChange={handleChange} className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Amenities (comma separated)</label>
              <input type="text" name="amenities" value={formData.amenities} onChange={handleChange} className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>

            <div className="md:col-span-2 text-lg font-bold text-gray-900 mt-4 border-b pb-2">Location</div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Street Address</label>
              <input type="text" name="address" required onChange={handleChange} className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input type="text" name="city" required onChange={handleChange} className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">State / Province</label>
              <input type="text" name="state" required onChange={handleChange} className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Country</label>
              <input type="text" name="country" required onChange={handleChange} className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>

            <div className="md:col-span-2 text-lg font-bold text-gray-900 mt-4 border-b pb-2">Property Images</div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Upload Images (3 to 5 required)</label>
              <input
                type="file"
                name="images"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          </div>

          <div className="pt-4">
            <button type="submit" disabled={loading} className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-70">
              {loading ? 'Uploading & Creating...' : 'Publish Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HostDashboard;