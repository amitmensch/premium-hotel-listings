import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const EditHotel = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '', description: '', pricePerNight: '', amenities: ''
  });

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const res = await api.get(`/hotels/${id}`);
        const hotel = res.data.data.hotel;
        setFormData({
          name: hotel.name,
          description: hotel.description,
          pricePerNight: hotel.pricePerNight,
          amenities: hotel.amenities.join(', ')
        });
      } catch (err) {
        setError('Could not load property details.');
      } finally {
        setInitialLoad(false);
      }
    };
    fetchHotel();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const updatedData = {
      name: formData.name,
      description: formData.description,
      pricePerNight: Number(formData.pricePerNight),
      amenities: formData.amenities.split(',').map(item => item.trim())
    };

    try {
      await api.patch(`/hotels/${id}`, updatedData);
      navigate(`/hotels/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update listing.');
      setLoading(false);
    }
  };

  if (initialLoad) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold mb-6">Edit Property</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {error && <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Property Name</label>
            <input type="text" name="name" value={formData.name} required onChange={handleChange} className="mt-1 block w-full px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea name="description" rows="4" value={formData.description} required onChange={handleChange} className="mt-1 block w-full px-4 py-2 border rounded-lg"></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Price per Night (USD)</label>
            <input type="number" name="pricePerNight" value={formData.pricePerNight} required onChange={handleChange} className="mt-1 block w-full px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Amenities (comma separated)</label>
            <input type="text" name="amenities" value={formData.amenities} required onChange={handleChange} className="mt-1 block w-full px-4 py-2 border rounded-lg" />
          </div>
          <button type="submit" disabled={loading} className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-70">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditHotel;