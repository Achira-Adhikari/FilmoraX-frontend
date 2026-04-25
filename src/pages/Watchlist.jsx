import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bookmark, Heart } from 'lucide-react';
import { api } from '../services/api';
import { useStore } from '../store/useStore';
import { MovieCard } from '../components/MovieCard';
import { CardSkeleton } from '../components/LoadingSkeleton';
import { getWatchlist } from '../services/watchlistService';

export const Watchlist = () => {
  const { user } = useStore();
  const [activeTab, setActiveTab] = useState('watchlist');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovies();
  }, [activeTab]);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      if (activeTab === 'watchlist') {
        const res = await getWatchlist();
        setMovies(res.data);
      } 
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950 pt-20 flex items-center justify-center">
        <div className="text-center">
          <Bookmark className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Please log in to view your watchlist</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 pt-20">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">My Collection</h1>

          <div className="flex gap-2 mb-8">
            <button
              onClick={() => setActiveTab('watchlist')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                activeTab === 'watchlist'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Bookmark className="w-5 h-5" />
              Watchlist ({movies.length})
            </button>
            {/* <button
              onClick={() => setActiveTab('favorites')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                activeTab === 'favorites'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Heart className="w-5 h-5" />
              Favorites ({favorites.length})
            </button> */}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {[...Array(6)].map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : movies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie.movie} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              {activeTab === 'watchlist' ? (
                <>
                  <Bookmark className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg mb-2">Your watchlist is empty</p>
                  <p className="text-gray-500">
                    Start adding movies you want to watch
                  </p>
                </>
              ) : (
                <>
                  <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg mb-2">No favorites yet</p>
                  <p className="text-gray-500">
                    Mark your favorite movies to see them here
                  </p>
                </>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
