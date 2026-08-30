import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const Reviews = ({ hotelId }) => {
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [error, setError] = useState('');

  const fetchReviews = async () => {
    try {
      const res = await api.get(`/hotels/${hotelId}/reviews`);
      setReviews(res.data.data.reviews);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [hotelId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post(`/hotels/${hotelId}/reviews`, {
        rating: Number(rating),
        review: reviewText,
      });
      setReviewText('');
      fetchReviews();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post review.');
    }
  };

  const handleDelete = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete your review?')) {
      try {
        await api.delete(`/reviews/${reviewId}`);
        fetchReviews();
      } catch (err) {
        alert('Failed to delete review.');
      }
    }
  };

  return (
    <section>
      <h2 className="font-serif text-2xl font-semibold text-ink-900">Guest reviews</h2>

      {user ? (
        <form onSubmit={handleSubmit} className="card mt-6 p-6">
          <h3 className="text-sm font-semibold text-ink-900">Leave a review</h3>
          {error && (
            <p className="mt-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
          )}
          <div className="mt-4 flex items-center gap-4">
            <label className="label !mb-0">Rating</label>
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="input !w-auto"
            >
              {[5, 4, 3, 2, 1].map((num) => (
                <option key={num} value={num}>{num} stars</option>
              ))}
            </select>
          </div>
          <textarea
            required
            rows="3"
            placeholder="How was your stay?"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className="input mt-4"
          />
          <div className="mt-4">
            <button type="submit" className="btn-primary !px-5 !py-2.5">Submit review</button>
          </div>
        </form>
      ) : (
        <p className="mt-4 text-sm text-ink-500">
          <Link
            to="/login"
            className="font-medium text-ink-900 underline decoration-brand-400 decoration-2 underline-offset-4 hover:text-brand-600"
          >
            Log in
          </Link>{' '}
          to leave a review.
        </p>
      )}

      <div className="mt-8 divide-y divide-ink-100">
        {reviews.length === 0 ? (
          <p className="py-4 text-sm text-ink-500">No reviews yet. Be the first to leave one.</p>
        ) : (
          reviews.map((item) => (
            <div key={item._id} className="py-6 first:pt-0">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-900 text-xs font-semibold text-white">
                    {(item.user?.name || 'A').charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink-900">
                      {item.user?.name || 'Anonymous'}
                    </p>
                    {user && item.user && user._id === item.user._id && (
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-xs font-medium text-red-500 transition-colors hover:text-red-700"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
                <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-ink-50 px-3 py-1 text-sm font-medium text-ink-800">
                  <FaStar className="text-amber-400" /> {item.rating}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">{item.review}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default Reviews;