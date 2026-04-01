import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, Trash2, AlertTriangle, Star } from 'lucide-react';
import { api } from '../../services/api';
import { deleteReview, getAllReview } from '../../services/reviewService';
import toast from 'react-hot-toast';

export const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [error, setError] = useState('');

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getAllReview();

      setReviews(res.data);

    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError(
        err?.response?.data?.message || "Failed to load reviews. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleDelete = (reviewId) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium">
          Are you sure you want to delete this review?
        </p>

        <div className="flex gap-2 justify-end">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 text-xs bg-gray-200 rounded-md"
          >
            Cancel
          </button>

          <button
            onClick={async () => {
              toast.dismiss(t.id);

              const loadingToast = toast.loading("Deleting review...");

              try {
                const res = await deleteReview(reviewId);

                toast.dismiss(loadingToast);
                toast.success("Review deleted successfully");

                fetchReviews();

              } catch (error) {
                toast.dismiss(loadingToast);
                console.log(error);
                toast.error(
                  error?.response?.data?.message ||
                  "Failed to delete review"
                );
              }
            }}
            className="px-3 py-1 text-xs bg-red-600 text-white rounded-md"
          >
            Delete
          </button>
        </div>
      </div>
    ));
  };

  const filteredReviews = reviews.filter(
    (review) =>
      review.user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name = "") => {
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map(word => word[0].toUpperCase())
      .join("");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Manage Reviews</h1>
        <div className="text-gray-400">
          Total Reviews: <span className="text-white font-semibold">{reviews.length}</span>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reviews..."
            className="w-full bg-gray-800 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                  {getInitials(review.user.full_name)}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-semibold">{review.user.full_name}</h3>
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-bold">{review.rating}/10</span>
                    </div>
                    {review.spoiler && (
                      <div className="flex items-center gap-1 text-red-400 text-sm">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Spoiler</span>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm">{new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) || 'N/A'}</p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(review.id)}
                className="p-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {review.title && (
              <h4 className="text-lg font-semibold text-white mb-2">{review.title}</h4>
            )}
            <p className="text-gray-300 leading-relaxed mb-3">{review.comment}</p>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>{review.helpful} found this helpful</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
