import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Film, Tv, Users, MessageSquare, TrendingUp, Activity } from 'lucide-react';
import { api } from '../../services/api';

const StatCard = ({ icon: Icon, label, value, change, color }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-gray-800 rounded-lg p-6 border border-gray-700"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change && (
          <div className="flex items-center gap-1 text-green-400 text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>+{change}%</span>
          </div>
        )}
      </div>
      <h3 className="text-3xl font-bold text-white mb-1">{value.toLocaleString()}</h3>
      <p className="text-gray-400 text-sm">{label}</p>
    </motion.div>
  );
};

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentReviews, setRecentReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, reviewsRes] = await Promise.all([
        api.admin.getStats(),
        api.admin.getRecentReviews()
      ]);
      setStats(statsRes.data);
      setRecentReviews(reviewsRes.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  const statCards = [
    { icon: Film, label: 'Total Movies', value: stats.totalMovies, change: 12, color: 'bg-blue-600' },
    { icon: Tv, label: 'Total TV Series', value: stats.totalTVSeries, change: 8, color: 'bg-green-600' },
    { icon: Users, label: 'Total Actors', value: stats.totalActors, change: 15, color: 'bg-purple-600' },
    { icon: MessageSquare, label: 'Total Reviews', value: stats.totalReviews, change: 24, color: 'bg-orange-600' }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Welcome back! Here's what's happening.</p>
        </div>
        <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg">
          <Activity className="w-5 h-5 text-green-400" />
          <span className="text-white font-semibold">{stats.recentActivity} active users</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <StatCard key={index} {...card} />
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-lg p-6 border border-gray-700"
        >
          <h2 className="text-xl font-bold text-white mb-6">Recent Reviews</h2>
          <div className="space-y-4">
            {recentReviews.slice(0, 5).map((review) => (
              <div key={review.id} className="bg-gray-900 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <img
                    src={review.userAvatar}
                    alt={review.userName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-white font-semibold truncate">{review.userName}</p>
                      <span className="text-yellow-400 text-sm font-bold">{review.rating}/10</span>
                    </div>
                    <p className="text-gray-400 text-sm line-clamp-2">{review.content}</p>
                    <p className="text-gray-500 text-xs mt-1">{review.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800 rounded-lg p-6 border border-gray-700"
        >
          <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg font-semibold transition-colors text-left">
              <Film className="w-6 h-6 mb-2" />
              Add Movie
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg font-semibold transition-colors text-left">
              <Tv className="w-6 h-6 mb-2" />
              Add TV Series
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg font-semibold transition-colors text-left">
              <Users className="w-6 h-6 mb-2" />
              Add Actor
            </button>
            <button className="bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-lg font-semibold transition-colors text-left">
              <MessageSquare className="w-6 h-6 mb-2" />
              Manage Reviews
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
