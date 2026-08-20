import { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import api from '../services/api';
import HotelCard from '../components/HotelCard';

const Home = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [destination, setDestination] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const fetchHotels = async (searchQuery = '') => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/hotels${searchQuery}`);
      setHotels(res.data.data.hotels);
    } catch (err) {
      setError('Failed to load properties. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    let queryParams = [];
    if (destination) queryParams.push(`destination=${destination}`);
    if (maxPrice) queryParams.push(`maxPrice=${maxPrice}`);
    
    const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
    fetchHotels(queryString);
  };

  const clearSearch = () => {
    setDestination('');
    setMaxPrice('');
    fetchHotels();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Find your next stay</h1>
        <p className="mt-2 text-lg text-gray-600">Discover premium properties and exclusive deals.</p>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-10">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Destination</label>
            <input 
              type="text" 
              placeholder="City, State, or Country" 
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="md:w-48">
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Max Price / Night</label>
            <input 
              type="number" 
              placeholder="e.g. 200" 
              min="1"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-end gap-2">
            <button 
              type="submit" 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center justify-center h-[50px]"
            >
              <FaSearch className="mr-2" /> Search
            </button>
            {(destination || maxPrice) && (
              <button 
                type="button" 
                onClick={clearSearch}
                className="px-4 py-3 text-gray-500 hover:bg-gray-100 rounded-lg font-medium transition-colors h-[50px]"
              >
                Clear
              </button>
            )}
          </div>
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="text-center py-20 text-red-500 font-medium bg-red-50 rounded-xl">{error}</div>
      ) : hotels.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-gray-500 font-medium">No properties found matching your search.</p>
          <button onClick={clearSearch} className="mt-4 text-blue-600 font-medium hover:underline">Clear filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {hotels.map((hotel) => (
            <HotelCard key={hotel._id} hotel={hotel} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;