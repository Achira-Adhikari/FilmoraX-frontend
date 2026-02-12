import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search as SearchIcon, Filter, X } from 'lucide-react';
import { api } from '../services/api';
import { MovieCard, TVCard } from '../components/MovieCard';
import { CardSkeleton } from '../components/LoadingSkeleton';

export const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [contentType, setContentType] = useState('movies');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [genres, setGenres] = useState([]);

  const [filters, setFilters] = useState({
    genre: '',
    year: '',
    minRating: ''
  });

  useEffect(() => {
    const fetchGenres = async () => {
      const genresRes = await api.genres.getAll();
      setGenres(genresRes.data);
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
      handleSearch(query);
    }
  }, [searchParams]);

  const handleSearch = async (query = searchQuery) => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      let res;
      if (contentType === 'movies') {
        res = await api.movies.search(query, filters);
      } else {
        res = await api.tvSeries.search(query, filters);
      }
      setResults(res.data);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery });
      handleSearch();
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const applyFilters = () => {
    handleSearch();
    setShowFilters(false);
  };

  const clearFilters = () => {
    setFilters({ genre: '', year: '', minRating: '' });
    handleSearch();
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  return (
    <div className="min-h-screen bg-gray-950 pt-20">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-8 text-center">
            Search Movies & TV Series
          </h1>

          <form onSubmit={handleSubmit} className="relative mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for movies, TV series, actors..."
              className="w-full bg-gray-800 text-white pl-6 pr-32 py-4 rounded-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-semibold transition-colors flex items-center gap-2"
            >
              <SearchIcon className="w-5 h-5" />
              Search
            </button>
          </form>

          <div className="flex items-center gap-4 justify-center">
            <div className="flex gap-2">
              <button
                onClick={() => setContentType('movies')}
                className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                  contentType === 'movies'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Movies
              </button>
              <button
                onClick={() => setContentType('tv')}
                className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                  contentType === 'tv'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                TV Series
              </button>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gray-900 rounded-lg p-6 mt-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Filters</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-gray-300 mb-2 text-sm">Genre</label>
                  <select
                    value={filters.genre}
                    onChange={(e) => handleFilterChange('genre', e.target.value)}
                    className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="">All Genres</option>
                    {genres.map((genre) => (
                      <option key={genre} value={genre}>
                        {genre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 text-sm">Year</label>
                  <select
                    value={filters.year}
                    onChange={(e) => handleFilterChange('year', e.target.value)}
                    className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="">All Years</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 text-sm">Min Rating</label>
                  <select
                    value={filters.minRating}
                    onChange={(e) => handleFilterChange('minRating', e.target.value)}
                    className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="">Any Rating</option>
                    <option value="9">9+ Excellent</option>
                    <option value="8">8+ Great</option>
                    <option value="7">7+ Good</option>
                    <option value="6">6+ Above Average</option>
                    <option value="5">5+ Average</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={applyFilters}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-colors"
                >
                  Apply Filters
                </button>
                <button
                  onClick={clearFilters}
                  className="px-6 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg font-semibold transition-colors"
                >
                  Clear
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">
            {searchQuery && (
              <>
                Search Results for "{searchQuery}"
                <span className="text-gray-400 text-lg ml-2">
                  ({results.length} {results.length === 1 ? 'result' : 'results'})
                </span>
              </>
            )}
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {[...Array(12)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {results.map((item) =>
              contentType === 'movies' ? (
                <MovieCard key={item.id} movie={item} />
              ) : (
                <TVCard key={item.id} series={item} />
              )
            )}
          </div>
        ) : searchQuery ? (
          <div className="text-center py-20">
            <SearchIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">
              No results found for "{searchQuery}"
            </p>
            <p className="text-gray-500 mt-2">
              Try different keywords or adjust your filters
            </p>
          </div>
        ) : (
          <div className="text-center py-20">
            <SearchIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">
              Start searching for your favorite movies and TV series
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
