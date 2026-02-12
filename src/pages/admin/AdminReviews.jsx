import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Trash2, AlertTriangle, Star } from 'lucide-react';
import { api } from '../../services/api';

export const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await api.admin.getRecentReviews();
      setReviews(res.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      await api.reviews.delete(id);
      fetchReviews();
    }
  };

  const filteredReviews = reviews.filter(
    (review) =>
      review.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                <img
                  src={review.userAvatar}
                  alt={review.userName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-semibold">{review.userName}</h3>
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
                  <p className="text-gray-400 text-sm">{review.date}</p>
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
            <p className="text-gray-300 leading-relaxed mb-3">{review.content}</p>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>{review.helpful} found this helpful</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
