import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Field = ({ label, ...props }) => (
  <div>
    <label className="label">{label}</label>
    <input {...props} className="input" />
  </div>
);

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
    amenities: 'Free WiFi, Air Conditioning',
  });
  const [images, setImages] = useState([]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleImageChange = (e) => setImages(e.target.files);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length < 3 || images.length > 5) {
      setError('Please select between 3 and 5 images.');
      return;
    }
    setLoading(true);
    setError('');
    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    for (let i = 0; i < images.length; i++) data.append('images', images[i]);
    try {
      const res = await api.post('/hotels', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate(`/hotels/${res.data.data.hotel._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create listing.');
      setLoading(false);
    }
  };

  return (
    <div className="container-page mx-auto max-w-4xl py-12 lg:py-16">
      <p className="eyebrow">Host dashboard</p>
      <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-ink-900">
        Create a listing
      </h1>
      <p className="mt-2 text-ink-500">Add a property to appear across PremiumStays.</p>

      <div className="card mt-10 p-6 sm:p-8">
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-10">
          <section>
            <h2 className="eyebrow border-b border-ink-100 pb-3">Property details</h2>
            <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="label">Property name</label>
                <input type="text" name="name" required onChange={handleChange} className="input" />
              </div>
              <div className="md:col-span-2">
                <label className="label">Description</label>
                <textarea name="description" rows="4" required onChange={handleChange} className="input" />
              </div>
              <Field
                label="Price per night (USD)"
                type="number"
                name="pricePerNight"
                min="1"
                required
                onChange={handleChange}
              />
              <Field
                label="Amenities (comma separated)"
                type="text"
                name="amenities"
                value={formData.amenities}
                onChange={handleChange}
              />
            </div>
          </section>

          <section>
            <h2 className="eyebrow border-b border-ink-100 pb-3">Location</h2>
            <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-2">
              <Field label="Street address" type="text" name="address" required onChange={handleChange} />
              <Field label="City" type="text" name="city" required onChange={handleChange} />
              <Field label="State / Province" type="text" name="state" required onChange={handleChange} />
              <Field label="Country" type="text" name="country" required onChange={handleChange} />
            </div>
          </section>

          <section>
            <h2 className="eyebrow border-b border-ink-100 pb-3">Images</h2>
            <div className="mt-5">
              <label className="label">Upload 3–5 photos</label>
              <input
                type="file"
                name="images"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="mt-1 block w-full cursor-pointer rounded-lg border border-dashed border-ink-300 bg-brand-50 p-5 text-sm text-ink-500 transition-colors file:mr-4 file:rounded-lg file:border-0 file:bg-ink-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:border-ink-400"
              />
              {images.length > 0 && (
                <p className="mt-2 text-sm text-ink-500">
                  {images.length} of 3–5 images selected
                </p>
              )}
            </div>
          </section>

          <div className="flex justify-end border-t border-ink-100 pt-6">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Publishing…' : 'Publish listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HostDashboard;