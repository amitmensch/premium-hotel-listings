import { useState, useEffect, useContext } from 'react';
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
        review: reviewText
      });
      setReviewText('');
      fetchReviews();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post review');
    }
  };

  const handleDelete = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete your review?')) {
      try {
        await api.delete(`/reviews/${reviewId}`);
        fetchReviews();
      } catch (err) {
        alert('Failed to delete review');
      }
    }
  };

  return (
    <div className="mt-10 border-t border-gray-100 pt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Guest Reviews</h2>

      {user ? (
        <form onSubmit={handleSubmit} className="mb-8 bg-gray-50 p-4 rounded-xl border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-2">Leave a Review</h3>
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-medium text-gray-700">Rating:</span>
            <select 
              value={rating} 
              onChange={(e) => setRating(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-sm bg-white"
            >
              {[5, 4, 3, 2, 1].map((num) => (
                <option key={num} value={num}>{num} Stars</option>
              ))}
            </select>
          </div>
          <textarea
            required
            rows="3"
            placeholder="How was your stay?"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg text-sm mb-3"
          ></textarea>
          <button type="submit" className="bg-blue-600 text-white font-bold px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
            Submit Review
          </button>
        </form>
      ) : (
        <p className="text-sm text-gray-500 mb-6">Please log in to leave a review.</p>
      )}

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-gray-500 text-sm">No reviews yet. Be the first to leave one!</p>
        ) : (
          reviews.map((item) => (
            <div key={item._id} className="p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-4">
                  <span className="font-bold text-gray-900">{item.user?.name || 'Anonymous'}</span>
                  {user && item.user && user._id === item.user._id && (
                    <button 
                      onClick={() => handleDelete(item._id)}
                      className="text-xs text-red-500 hover:text-red-700 font-medium"
                    >
                      Delete
                    </button>
                  )}
                </div>
                <div className="flex items-center text-yellow-400">
                  <FaStar className="mr-1" />
                  <span className="font-bold text-gray-700 text-sm">{item.rating}</span>
                </div>
              </div>
              <p className="text-gray-600 text-sm mt-1">{item.review}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Reviews;