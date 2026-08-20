import { Link } from 'react-router-dom';
import { FaMapMarkerAlt } from 'react-icons/fa';

const HotelCard = ({ hotel }) => {
  const imageUrl = hotel.images && hotel.images.length > 0
    ? hotel.images[0]
    : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
      <img src={imageUrl} alt={hotel.name} className="w-full h-48 object-cover" />
      <div className="p-5">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{hotel.name}</h3>
          <span className="text-lg font-extrabold text-blue-600">
            ${hotel.pricePerNight}
            <span className="text-sm font-normal text-gray-500">/nt</span>
          </span>
        </div>
        <div className="flex items-center mt-2 text-gray-500 text-sm">
          <FaMapMarkerAlt className="mr-1 text-gray-400" />
          {hotel.location.city}, {hotel.location.country}
        </div>
        <p className="mt-3 text-sm text-gray-600 line-clamp-2">{hotel.description}</p>
        <div className="mt-5">
          <Link
            to={`/hotels/${hotel._id}`}
            className="block w-full text-center bg-gray-50 border border-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;