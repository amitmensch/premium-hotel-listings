import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState('Processing your booking...');
  
  // Use a ref to prevent React StrictMode from double-booking
  const hasBooked = useRef(false);

  useEffect(() => {
    const finalizeBooking = async () => {
      if (hasBooked.current) return;
      hasBooked.current = true;

      const params = new URLSearchParams(location.search);
      const bookingData = {
        hotelId: params.get('hotelId'),
        checkIn: params.get('checkIn'),
        checkOut: params.get('checkOut'),
        totalPrice: Number(params.get('price'))
      };

      try {
        await api.post('/bookings', bookingData);
        setStatus('Payment successful! Booking confirmed.');
        setTimeout(() => {
          navigate('/my-bookings');
        }, 3000);
      } catch (err) {
        setStatus('Payment verified, but booking failed to save. Please contact support.');
      }
    };

    finalizeBooking();
  }, [location, navigate]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="bg-white p-10 rounded-2xl shadow-lg border border-gray-100 max-w-md w-full">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Success!</h2>
        <p className="text-gray-600 mb-6">{status}</p>
        <p className="text-sm text-gray-400">Redirecting to your trips...</p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
