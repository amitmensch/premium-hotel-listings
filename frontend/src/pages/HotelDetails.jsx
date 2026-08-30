import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaCheck, FaArrowLeft } from 'react-icons/fa';
import api from '../services/api';
import Reviews from '../components/Reviews';
import Map from '../components/Map';
import { AuthContext } from '../context/AuthContext';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80';

const HotelDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingMessage, setBookingMessage] = useState({ type: '', text: '' });

  const handleDeleteHotel = async () => {
    if (window.confirm('Are you sure you want to delete this property? This cannot be undone.')) {
      try {
        await api.delete(`/hotels/${id}`);
        navigate('/');
      } catch (err) {
        alert('Failed to delete property.');
      }
    }
  };

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const res = await api.get(`/hotels/${id}`);
        setHotel(res.data.data.hotel);
      } catch (err) {
        setError('Could not fetch hotel details.');
      } finally {
        setLoading(false);
      }
    };
    fetchHotel();
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!checkIn || !checkOut) {
      setBookingMessage({ type: 'error', text: 'Please select check-in and check-out dates.' });
      return;
    }
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    if (start >= end) {
      setBookingMessage({ type: 'error', text: 'Check-out must be after check-in.' });
      return;
    }
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * hotel.pricePerNight;
    setBookingLoading(true);
    setBookingMessage({ type: '', text: '' });
    try {
      const res = await api.post('/bookings/checkout-session', {
        hotelId: hotel._id,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        totalPrice,
      });
      window.location.href = res.data.sessionUrl;
    } catch (err) {
      setBookingMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to initialize checkout.',
      });
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-ink-200 border-t-ink-800" />
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="font-serif text-3xl font-semibold text-ink-900">
          {error || 'Property not found'}
        </h1>
        <Link to="/" className="btn-primary mt-8">Back to listings</Link>
      </div>
    );
  }

  const images = hotel.images && hotel.images.length > 0 ? hotel.images : [FALLBACK_IMAGE];
  const location = hotel.location || {};

return (
    <div className="container-page py-10 lg:py-14">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-ink-500 transition-colors hover:text-ink-900"
      >
        <FaArrowLeft className="text-xs" /> Back to listings
      </Link>

      <section className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        <img
          src={images[0]}
          alt={`${hotel.name} — main`}
          className="col-span-2 aspect-[16/10] w-full rounded-2xl object-cover md:col-span-4 md:aspect-[21/9]"
        />
        {images.slice(1, 5).map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`${hotel.name} — ${idx + 1}`}
            className="aspect-[4/3] w-full rounded-xl object-cover"
          />
        ))}
      </section>

      <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="font-serif text-4xl font-semibold tracking-tight text-ink-900 lg:text-5xl">
            {hotel.name}
          </h1>
          <p className="mt-3 flex items-start gap-2 text-ink-500">
            <FaMapMarkerAlt className="mt-1 shrink-0 text-ink-400" />
            <span>
              {[location.address, location.city, location.state, location.country]
                .filter(Boolean)
                .join(', ')}
            </span>
          </p>
        </div>
        {user && hotel.host && user._id === hotel.host._id && (
          <div className="flex gap-3">
            <Link to={`/host/edit/${hotel._id}`} className="btn-ghost">Edit property</Link>
            <button
              onClick={handleDeleteHotel}
              className="rounded-lg border border-red-200 bg-white px-6 py-3 text-sm font-medium tracking-wide text-red-600 transition-colors hover:bg-red-500 hover:text-white"
            >
              Delete property
            </button>
          </div>
        )}
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-3">
        <div className="space-y-14 lg:col-span-2">
          <section>
            <h2 className="font-serif text-2xl font-semibold text-ink-900">About this property</h2>
            <p className="mt-4 leading-relaxed text-ink-600">{hotel.description}</p>
          </section>

          {hotel.amenities && hotel.amenities.length > 0 && (
            <section>
              <h2 className="font-serif text-2xl font-semibold text-ink-900">Amenities</h2>
              <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                {hotel.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-3 text-ink-700">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ink-100">
                      <FaCheck className="text-[10px] text-ink-600" />
                    </span>
                    {amenity}
                  </div>
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="font-serif text-2xl font-semibold text-ink-900">Where you'll be</h2>
            <div className="mt-5">
              <Map location={`${location.city}, ${location.country}`} name={hotel.name} />
            </div>
          </section>

          <Reviews hotelId={hotel._id} />
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="card p-7">
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-4xl font-semibold text-ink-900">
                ${hotel.pricePerNight}
              </span>
              <span className="text-sm text-ink-500">/ night</span>
            </div>

            {bookingMessage.text && (
              <div
                className={`mt-5 rounded-lg px-4 py-3 text-sm ${
                  bookingMessage.type === 'success'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-red-50 text-red-700'
                }`}
              >
                {bookingMessage.text}
              </div>
            )}

            <form onSubmit={handleBooking} className="mt-6 space-y-5">
              <div>
                <label htmlFor="checkIn" className="label">Check-in</label>
                <input
                  id="checkIn"
                  type="date"
                  required
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="input"
                />
              </div>
              <div>
                <label htmlFor="checkOut" className="label">Check-out</label>
                <input
                  id="checkOut"
                  type="date"
                  required
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="input"
                />
              </div>
              <button type="submit" disabled={bookingLoading} className="btn-primary w-full">
                {bookingLoading ? 'Reserving…' : 'Reserve now'}
              </button>
            </form>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default HotelDetails;