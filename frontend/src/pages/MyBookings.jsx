import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import api from '../services/api';

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">My Trips</h1>
      <p className="text-gray-600 mb-8">View and manage your upcoming reservations.</p>

      {error && <div className="p-4 bg-red-50 text-red-700 rounded-lg mb-6">{error}</div>}

      {bookings.length === 0 && !error ? (
        <div className="text-center py-20 bg-white border border-gray-200 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-2">No trips booked... yet!</h2>
          <p className="text-gray-500 mb-6">Time to dust off your bags and start planning your next adventure.</p>
          <Link to="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Start Searching
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => {
            const hotel = booking.hotel;
            const imageUrl = hotel?.images?.length > 0 
              ? hotel.images[0] 
              : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80';

            return (
              <div key={booking._id} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-shadow">
                <div className="w-full md:w-72 h-56 flex-shrink-0">
                  <img 
                    src={imageUrl} 
                    alt={hotel?.name} 
                    className="w-full h-full object-cover rounded-t-xl md:rounded-tr-none md:rounded-l-xl" 
                  />
                </div>
                
                <div className="p-6 md:w-2/3 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        {hotel?.name || 'Property Unavailable'}
                      </h3>
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold uppercase rounded-full tracking-wide">
                        {booking.status}
                      </span>
                    </div>
                    
                    {hotel && (
                      <div className="flex items-center text-gray-500 text-sm mb-4">
                        <FaMapMarkerAlt className="mr-2 text-gray-400" />
                        {hotel.location.city}, {hotel.location.country}
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 mb-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <div>
                        <span className="block text-xs font-bold text-gray-500 uppercase mb-1 flex items-center">
                          <FaCalendarAlt className="mr-2" /> Check-in
                        </span>
                        <span className="font-medium text-gray-900">{formatDate(booking.checkIn)}</span>
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-gray-500 uppercase mb-1 flex items-center">
                          <FaCalendarAlt className="mr-2" /> Check-out
                        </span>
                        <span className="font-medium text-gray-900">{formatDate(booking.checkOut)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-end border-t border-gray-100 pt-4 mt-2">
                    <div>
                      <span className="block text-sm text-gray-500">Total Price</span>
                      <span className="text-2xl font-extrabold text-blue-600">${booking.totalPrice}</span>
                    </div>
                    {hotel && (
                      <Link to={`/hotels/${hotel._id}`} className="text-sm font-medium text-blue-600 hover:text-blue-800">
                        View Property
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBookings;