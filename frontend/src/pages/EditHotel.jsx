import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const EditHotel = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({ name: '', description: '', pricePerNight: '', amenities: '' });

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const res = await api.get(`/hotels/${id}`);
        const hotel = res.data.data.hotel;
        setFormData({
          name: hotel.name,
          description: hotel.description,
          pricePerNight: hotel.pricePerNight,
          amenities: hotel.amenities.join(', '),
        });
      } catch (err) {
        setError('Could not load property details.');
      } finally {
        setInitialLoad(false);
      }
    };
    fetchHotel();
  }, [id]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const updatedData = {
      name: formData.name,
      description: formData.description,
      pricePerNight: Number(formData.pricePerNight),
      amenities: formData.amenities.split(',').map((s) => s.trim()),
    };
    try {
      await api.patch(`/hotels/${id}`, updatedData);
      navigate(`/hotels/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update listing.');
      setLoading(false);
    }
  };

  if (initialLoad) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-ink-200 border-t-ink-800" />
      </div>
    );
  }

  return (
    <div className="container-page mx-auto max-w-3xl py-12 lg:py-16">
      <p className="eyebrow">Host dashboard</p>
      <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-ink-900">
        Edit property
      </h1>

      <div className="card mt-10 p-6 sm:p-8">
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="label">Property name</label>
            <input type="text" name="name" value={formData.name} required onChange={handleChange} className="input" />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea name="description" rows="4" value={formData.description} required onChange={handleChange} className="input" />
          </div>
          <div>
            <label className="label">Price per night (USD)</label>
            <input type="number" name="pricePerNight" min="1" value={formData.pricePerNight} required onChange={handleChange} className="input" />
          </div>
          <div>
            <label className="label">Amenities (comma separated)</label>
            <input type="text" name="amenities" value={formData.amenities} required onChange={handleChange} className="input" />
          </div>
          <div className="flex justify-end border-t border-ink-100 pt-6">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditHotel;