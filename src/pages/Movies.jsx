import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MovieCard } from "../components/MovieCard";
import { CardSkeleton } from "../components/LoadingSkeleton";
import * as movieService from "../services/movieService";
 
export const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [movieCount, setMovieCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("popular");
 
  useEffect(() => {
    fetchMovies(activeTab);
  }, [activeTab]);
 
  const fetchMovies = async (tab) => {
    setLoading(true);
    try {
      const filterValue = tab.replace("-", "_");
      const res = await movieService.getAllMovies(filterValue);
 
      setMovies(res.data.movies);
      setMovieCount(res.data.count);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };
 
  const tabs = [
    { id: "popular", label: "Popular" },
    { id: "trending", label: "Trending" },
    { id: "top-rated", label: "Top Rated" },
    { id: "upcoming", label: "Upcoming" },
  ];
 
  return (
    <div className="min-h-screen bg-gray-950 pt-20">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
         
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white">Movies</h1>
            {!loading && (
              <p className="text-gray-400 mt-2 font-medium">
                {movieCount} {movieCount === 1 ? 'Movie' : 'Movies'} found
              </p>
            )}
          </div>
 
          {/* Tabs */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
 
          {/* Grid Layout */}
          {loading ? (
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
               {[...Array(12)].map((_, i) => <CardSkeleton key={i} />)}
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