import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaCheck, FaArrowLeft } from 'react-icons/fa';
import api from '../services/api';
import Reviews from '../components/Reviews';
import Map from '../components/Map';
import { AuthContext } from '../context/AuthContext';

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
      setBookingMessage({ type: 'error', text: 'Check-out date must be after check-in date.' });
      return;
    }

    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * hotel.pricePerNight;

    setBookingLoading(true);
    setBookingMessage({ type: '', text: '' });

    try {
      // 1. Ask backend for a Stripe checkout session URL
      const res = await api.post('/bookings/checkout-session', {
        hotelId: hotel._id,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        totalPrice
      });

      // 2. Redirect the user to Stripe's secure checkout page
      window.location.href = res.data.sessionUrl;
    } catch (err) {
      setBookingMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to initialize checkout.'
      });
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-red-500 font-medium">
        {error || 'Hotel not found'}
      </div>
    );
  }

  const imageUrl = hotel.images?.length > 0
    ? hotel.images[0]
    : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 font-medium">
        <FaArrowLeft className="mr-2" /> Back to listings
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* NEW: Professional Image Gallery */}
        <div className="flex flex-col gap-2 mb-8">
          {/* Primary Image - Fixed height, object-cover prevents stretching */}
          <img 
            src={hotel.images[0] || imageUrl} 
            alt={`${hotel.name} main`} 
            className="w-full h-[300px] md:h-[450px] object-cover rounded-2xl" 
          />
          
          {/* Secondary Images Grid */}
          {hotel.images.length > 1 && (
            <div className={`grid gap-2 ${
              hotel.images.length === 3 ? 'grid-cols-2' : 
              hotel.images.length === 4 ? 'grid-cols-3' : 'grid-cols-4'
            }`}>
              {hotel.images.slice(1, 5).map((img, idx) => (
                <img 
                  key={idx} 
                  src={img} 
                  alt={`${hotel.name} gallery ${idx + 1}`} 
                  className="w-full h-32 md:h-48 object-cover rounded-xl hover:opacity-90 transition-opacity cursor-pointer" 
                />
              ))}
            </div>
          )}
        </div>
        
        <div className="p-8 md:flex justify-between gap-8">
          <div className="md:w-2/3">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{hotel.name}</h1>
            {user && hotel.host && user._id === hotel.host._id && (
              <div className="flex gap-3 mb-4 mt-2">
                <Link 
                  to={`/host/edit/${hotel._id}`} 
                  className="text-sm bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200"
                >
                  Edit Property
                </Link>
                <button 
                  onClick={handleDeleteHotel}
                  className="text-sm bg-red-50 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-100"
                >
                  Delete Property
                </button>
              </div>
            )}
            <div className="flex items-center text-gray-500 mb-6">
              <FaMapMarkerAlt className="mr-2 text-gray-400" />
              {hotel.location.address}, {hotel.location.city}, {hotel.location.state}, {hotel.location.country}
            </div>
            
            <h2 className="text-xl font-bold text-gray-900 mb-3">About this property</h2>
            <p className="text-gray-600 leading-relaxed mb-8">{hotel.description}</p>
            
            <h2 className="text-xl font-bold text-gray-900 mb-4">Amenities</h2>
            <div className="grid grid-cols-2 gap-y-3">
              {hotel.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center text-gray-600">
                  <FaCheck className="mr-3 text-green-500" /> {amenity}
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-sm text-gray-500 border-t border-gray-100 pt-6">
              Listed by: <span className="font-medium text-gray-900">{hotel.host?.name || 'Unknown Host'}</span>
            </div>

            {/* NEW: Map Section */}
            <div className="mt-10 border-t border-gray-100 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Where you'll be</h2>
              <Map location={`${hotel.location.city}, ${hotel.location.country}`} name={hotel.name} />
            </div>

            <Reviews hotelId={hotel._id} />
          </div>

          <div className="md:w-1/3 mt-8 md:mt-0">
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 sticky top-24">
              <div className="text-3xl font-extrabold text-blue-600 mb-4">
                ${hotel.pricePerNight} <span className="text-base font-normal text-gray-500">/ night</span>
              </div>

              {bookingMessage.text && (
                <div className={`mb-4 p-3 rounded-lg text-sm ${
                  bookingMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                  {bookingMessage.text}
                </div>
              )}

              <form onSubmit={handleBooking} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase">Check-In</label>
                  <input 
                    type="date" 
                    required 
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase">Check-Out</label>
                  <input 
                    type="date" 
                    required 
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={bookingLoading}
                  className="w-full mt-2 bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
                >
                  {bookingLoading ? 'Reserving...' : 'Reserve Now'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetails;