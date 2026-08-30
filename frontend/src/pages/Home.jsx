import { useState, useEffect } from 'react';
import { FaSearch, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import api from '../services/api';
import HotelCard from '../components/HotelCard';

const SkeletonCard = () => (
  <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white">
    <div className="skeleton aspect-[4/3] rounded-none" />
    <div className="space-y-3 p-6">
      <div className="skeleton h-5 w-2/3" />
      <div className="skeleton h-4 w-1/3" />
      <div className="skeleton h-4 w-full" />
      <div className="skeleton h-4 w-4/5" />
    </div>
  </div>
);

const Home = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [destination, setDestination] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalHotels, setTotalHotels] = useState(0);

  const fetchHotels = async (query = '', page = 1) => {
    setLoading(true);
    setError('');
    try {
      const separator = query ? '&' : '?';
      const res = await api.get(`/hotels${query}${separator}page=${page}&limit=6`);
      setHotels(res.data.data.hotels);
      setTotalPages(res.data.pagination.totalPages);
      setTotalHotels(res.data.pagination.totalHotels);
      setCurrentPage(res.data.pagination.currentPage);
    } catch (err) {
      setError("We couldn't load properties right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels('', 1);
  }, []);

  const buildQuery = () => {
    const params = [];
    if (destination) params.push(`destination=${encodeURIComponent(destination)}`);
    if (maxPrice) params.push(`maxPrice=${maxPrice}`);
    return params.length ? `?${params.join('&')}` : '';
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchHotels(buildQuery(), 1);
  };

  const clearSearch = () => {
    setDestination('');
    setMaxPrice('');
    fetchHotels('', 1);
  };

  const goToPage = (page) => fetchHotels(buildQuery(), page);

  return (
    <div className="container-page py-12 lg:py-16">
      {/* Hero */}
      <section className="max-w-2xl">
        <p className="eyebrow">Curated luxury stays</p>
        <h1 className="mt-4 font-serif text-4xl font-semibold leading-[1.05] tracking-tight text-ink-900 sm:text-5xl">
          Find your next <span className="italic text-brand-600">stay.</span>
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-500">
          Discover hand-picked hotels and private residences — each vetted for comfort,
          character, and quiet luxury.
        </p>
      </section>

      {/* Search */}
      <section className="mt-10">
        <form
          onSubmit={handleSearch}
          className="card flex flex-col gap-4 p-4 md:flex-row md:items-end md:p-5"
        >
          <div className="flex-1">
            <label htmlFor="destination" className="label">Destination</label>
            <input
              id="destination"
              type="text"
              placeholder="City, state, or country"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="input"
            />
          </div>
          <div className="md:w-44">
            <label htmlFor="maxPrice" className="label">Max price / night</label>
            <input
              id="maxPrice"
              type="number"
              min="1"
              placeholder="Any"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="input"
            />
          </div>
          <div className="flex items-center gap-2">
            <button type="submit" className="btn-primary h-[42px] gap-2">
              <FaSearch className="text-xs" /> Search
            </button>
            {(destination || maxPrice) && (
              <button type="button" onClick={clearSearch} className="btn-ghost h-[42px]">
                Clear
              </button>
            )}
          </div>
        </form>
      </section>

      {/* Results */}
      {loading ? (
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : error ? (
        <div className="mt-12 rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center">
          <p className="text-sm font-medium text-red-700">{error}</p>
        </div>
      ) : hotels.length === 0 ? (
        <div className="mt-12 flex flex-col items-center py-20 text-center">
          <h2 className="font-serif text-3xl font-semibold text-ink-900">
            No properties found.
          </h2>
          <p className="mt-2 max-w-md text-ink-500">
            Try a different destination or relax your price filter.
          </p>
          <button onClick={clearSearch} className="btn-ghost mt-6">Clear filters</button>
        </div>
      ) : (
        <>
          <p className="eyebrow mt-14">
            {totalHotels} {totalHotels === 1 ? 'property' : 'properties'}
          </p>
          <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {hotels.map((hotel) => (
              <HotelCard key={hotel._id} hotel={hotel} />
            ))}
          </div>

          {totalPages > 1 && (
            <nav className="mt-14 flex items-center justify-center gap-8">
              <button
                onClick={() => goToPage(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-2 text-sm font-medium text-ink-600 transition-colors hover:text-ink-900 disabled:pointer-events-none disabled:opacity-30"
              >
                <FaArrowLeft className="text-xs" /> Previous
              </button>
              <span className="text-sm tabular-nums text-ink-400">
                Page {currentPage} <span className="mx-1 text-ink-300">of</span> {totalPages}
              </span>
              <button
                onClick={() => goToPage(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center gap-2 text-sm font-medium text-ink-600 transition-colors hover:text-ink-900 disabled:pointer-events-none disabled:opacity-30"
              >
                Next <FaArrowRight className="text-xs" />
              </button>
            </nav>
          )}
        </>
      )}
    </div>
  );
};

export default Home;