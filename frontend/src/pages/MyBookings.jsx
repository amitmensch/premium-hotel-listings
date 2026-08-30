import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa';
import api from '../services/api';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        const res = await api.get('/bookings/my-bookings');
        setBookings(res.data.data.bookings);
      } catch (err) {
        setError('Failed to load your trips. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchMyBookings();
  }, []);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this reservation? This cannot be undone.')) {
      try {
        await api.delete(`/bookings/${bookingId}`);
        setBookings((prev) => prev.filter((b) => b._id !== bookingId));
      } catch (err) {
        alert('Failed to cancel booking.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-ink-200 border-t-ink-800" />
      </div>
    );
  }

  return (
    <div className="container-page max-w-5xl py-12 lg:py-16">
      <p className="eyebrow">Your reservations</p>
      <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-ink-900">
        My trips
      </h1>

      {error && (
        <div className="mt-8 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {!error && bookings.length === 0 ? (
        <div className="mt-10 flex flex-col items-center rounded-2xl border border-ink-100 bg-white px-6 py-20 text-center">
          <h2 className="font-serif text-3xl font-semibold text-ink-900">No trips yet.</h2>
          <p className="mt-2 max-w-sm text-ink-500">
            Your upcoming reservations will appear here — start planning your next escape.
          </p>
          <Link to="/" className="btn-primary mt-8">Browse properties</Link>
        </div>
      ) : (
        <div className="mt-10 space-y-6">
          {bookings.map((booking) => {
            const hotel = booking.hotel;
            const imageUrl = hotel?.images?.length > 0 ? hotel.images[0] : FALLBACK_IMAGE;
            const cancelled = booking.status === 'cancelled';
            return (
              <article
                key={booking._id}
                className="card flex flex-col overflow-hidden transition-all duration-300 ease-out hover:shadow-lift md:flex-row"
              >
                <div className="md:w-64 md:shrink-0">
                  <img
                    src={imageUrl}
                    alt={hotel?.name}
                    className="h-52 w-full object-cover md:h-full"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6 lg:p-7">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-serif text-2xl font-semibold text-ink-900">
                      {hotel?.name || 'Property unavailable'}
                    </h3>
                    <span
                      className={`shrink-0 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wider ${
                        cancelled
                          ? 'border-ink-200 bg-ink-50 text-ink-500'
                          : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  {hotel && (
                    <p className="mt-1.5 flex items-center gap-2 text-sm text-ink-500">
                      <FaMapMarkerAlt className="text-ink-400" />
                      {hotel.location.city}, {hotel.location.country}
                    </p>
                  )}

                  <div className="mt-5 grid grid-cols-2 gap-6">
                    <div>
                      <p className="label !mb-1">Check-in</p>
                      <p className="text-sm font-medium text-ink-800">
                        {formatDate(booking.checkIn)}
                      </p>
                    </div>
                    <div>
                      <p className="label !mb-1">Check-out</p>
                      <p className="text-sm font-medium text-ink-800">
                        {formatDate(booking.checkOut)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex items-end justify-between border-t border-ink-100 pt-5">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-400">
                        Total
                      </p>
                      <p className="font-serif text-2xl font-semibold text-ink-900">
                        ${booking.totalPrice}
                      </p>
                    </div>
                    <div className="flex items-center gap-6">
                      {hotel && (
                        <Link
                          to={`/hotels/${hotel._id}`}
                          className="inline-flex items-center gap-2 text-sm font-medium text-ink-600 transition-colors hover:text-ink-900"
                        >
                          View property <FaArrowRight className="text-xs" />
                        </Link>
                      )}
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        disabled={cancelled}
                        className="text-sm font-medium text-red-500 transition-colors hover:text-red-700 disabled:pointer-events-none disabled:opacity-40"
                      >
                        {cancelled ? 'Cancelled' : 'Cancel trip'}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBookings;