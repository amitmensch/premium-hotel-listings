import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaCheck } from 'react-icons/fa';
import api from '../services/api';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState('Processing your booking…');
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
        totalPrice: Number(params.get('price')),
      };

      try {
        await api.post('/bookings', bookingData);
        setStatus("Booking confirmed. We'll see you soon.");
        setTimeout(() => navigate('/my-bookings'), 3000);
      } catch (err) {
        setStatus('Payment verified, but the booking could not be saved. Please contact support.');
      }
    };

    finalizeBooking();
  }, [location, navigate]);

  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <div className="card w-full max-w-md p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
          <FaCheck className="text-emerald-600" />
        </div>
        <h1 className="mt-6 font-serif text-3xl font-semibold text-ink-900">Thank you.</h1>
        <p className="mt-2 text-ink-500">{status}</p>
        <p className="mt-6 text-sm text-ink-400">Redirecting to your trips…</p>
      </div>
    </div>
  );
};

export default PaymentSuccess;