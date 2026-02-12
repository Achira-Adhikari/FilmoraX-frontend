import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import { MovieCard } from '../components/MovieCard';
import { CardSkeleton } from '../components/LoadingSkeleton';

export const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('popular');

  useEffect(() => {
    fetchMovies(activeTab);
  }, [activeTab]);

  const fetchMovies = async (tab) => {
    setLoading(true);
    try {
      let res;
      switch (tab) {
        case 'trending':
          res = await api.movies.getTrending();
          break;
        case 'popular':
          res = await api.movies.getPopular();
          break;
        case 'top-rated':
          res = await api.movies.getTopRated();
          break;
        case 'upcoming':
          res = await api.movies.getUpcoming();
          break;
        default:
          res = await api.movies.getAll();
      }
      setMovies(res.data);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'popular', label: 'Popular' },
    { id: 'trending', label: 'Trending' },
    { id: 'top-rated', label: 'Top Rated' },
    { id: 'upcoming', label: 'Upcoming' }
  ];

  return (
    <div className="min-h-screen bg-gray-950 pt-20">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">Movies</h1>

          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {[...Array(12)].map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
