import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Info, ChevronLeft, ChevronRight, TrendingUp, Calendar, Star } from 'lucide-react';
import { api } from '../services/api';
import { MovieCard, TVCard } from '../components/MovieCard';
import { HeroSkeleton, CardSkeleton } from '../components/LoadingSkeleton';
import { TrailerModal } from '../components/Modal';
import { getHomeData } from '../services/homeService';

// --- Hero Section Component ---
const HeroSection = ({ movies }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [trailerOpen, setTrailerOpen] = useState(false);

  useEffect(() => {
    if (movies.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [movies.length]);

  const movie = movies[currentIndex];

  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % movies.length);

  if (!movie) return <HeroSkeleton />;

  return (
    <>
      <div className="relative h-[80vh] md:h-[90vh] w-full overflow-hidden bg-gray-950">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
            <img
              src={movie.poster_url_landscape}
              alt={movie.title}
              className="w-full h-full object-cover object-top opacity-70 md:opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-transparent to-transparent" />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-6 md:px-16">
            <motion.div
              key={`content-${currentIndex}`}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="max-w-3xl"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 backdrop-blur-md px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest flex items-center gap-2 w-fit">
                  <TrendingUp className="w-3 h-3" /> Trending Now
                </span>
              </div>
              <h1 className="text-4xl md:text-7xl font-black text-white mb-4 md:mb-6 leading-tight tracking-tighter">
                {movie.title}
              </h1>
              <p className="text-gray-300 text-sm md:text-xl mb-6 md:mb-8 line-clamp-3 max-w-xl leading-relaxed">
                {movie.synopsis}
              </p>
              
              <div className="flex flex-wrap gap-3 md:gap-4">
                <Link
                  to={`/movie/${movie.id}`}
                  className="group flex items-center gap-2 md:gap-3 bg-blue-600 hover:bg-blue-500 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-sm md:text-lg transition-all shadow-xl shadow-blue-600/20"
                >
                  <Play className="w-5 h-5 fill-current" />
                  Watch Now
                </Link>
                <button
                  onClick={() => setTrailerOpen(true)}
                  className="flex items-center gap-2 md:gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/10 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-sm md:text-lg transition-all"
                >
                  <Info className="w-5 h-5" />
                  Details
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Desktop Dots Navigation */}
        <div className="hidden md:flex absolute bottom-24 left-16 items-center gap-3">
          {movies.slice(0, 5).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-1.5 transition-all duration-500 rounded-full ${
                index === currentIndex ? 'bg-blue-600 w-10' : 'bg-white/20 w-4'
              }`}
            />
          ))}
        </div>
      </div>

      <TrailerModal
        isOpen={trailerOpen}
        onClose={() => setTrailerOpen(false)}
        trailerUrl={movie.trailer_url}
        title={movie.title}
      />
    </>
  );
};

// --- Helper Components ---
const SectionHeader = ({ title, icon: Icon }) => (
  <div className="flex items-center justify-between mb-6 md:mb-10">
    <div className="flex items-center gap-3">
      {Icon && <Icon className="w-5 h-5 md:w-7 md:h-7 text-blue-500" />}
      <h2 className="text-xl md:text-3xl font-black text-white tracking-tight uppercase">{title}</h2>
    </div>
    <div className="h-[1px] flex-1 mx-4 md:mx-8 bg-gradient-to-r from-blue-600/40 to-transparent rounded-full opacity-30" />
  </div>
);

const MovieGrid = ({ items, type = 'movie', loading }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-8">
    {loading
      ? [...Array(6)].map((_, i) => <CardSkeleton key={i} />)
      : items.map((item) => (
          type === 'movie' 
            ? <MovieCard key={item.id} movie={item} /> 
            : <TVCard key={item.id} series={item} />
        ))}
  </div>
);

// --- Main Home Component ---
export const Home = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    trending: [],
    popular: [],
    topRated: [],
    upcoming: [],
    trendingTV: [],
    hero:[]
  });

   const fetchHomeData = useCallback(async () => {
    try {
      const res = await getHomeData();
      const {
        trendingNow = [],
        popularMovies = [],
        criticsChoice = [],
        comingSoon = [],
        hotTvSeries = [],
        hero = [],
      } = res.data || {};

      setData({
        trending: trendingNow,
        popular: popularMovies,
        topRated: criticsChoice,
        upcoming: comingSoon,
        trendingTV: hotTvSeries,
        hero,
      });
    } catch (error) {
      console.error("Home Page Data Error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHomeData();
  }, [fetchHomeData]);

  return (
    <div className="min-h-screen bg-gray-950 pb-20 overflow-x-hidden">
      {/* Hero Banner */}
      {loading ? <HeroSkeleton /> : <HeroSection movies={data.trending} />}

      {/* Main Content Sections */}
      <div className="container mx-auto px-4 md:px-16 relative z-20 -mt-10 md:-mt-20">
        
        {/* Upcoming Section (දැන් මෙය ඉහළින්ම පෙන්වයි) */}
        {data.upcoming.length > 0 && (
          <section className="mb-16 md:mb-24">
            <SectionHeader title="Coming Soon" icon={Calendar} />
            <MovieGrid items={data.upcoming} loading={loading} />
          </section>
        )}

        {/* Trending Section */}
        {data.trending.length > 0 && (
          <section className="mb-16 md:mb-24">
          <SectionHeader title="Trending Now" icon={TrendingUp} />
          <MovieGrid items={data.trending} loading={loading} />
        </section>
        )}

        {/* Popular Movies Section */}
        {data.popular.length > 0 && (
          <section className="mb-16 md:mb-24">
          <SectionHeader title="Popular Movies" />
          <MovieGrid items={data.popular} loading={loading} />
        </section>
        )}

        {/* TV Series Section */}
        {data.trendingTV.length > 0 && (
          <section className="mb-16 md:mb-24">
          <SectionHeader title="Hot TV Series" />
          <MovieGrid items={data.trendingTV} type="tv" loading={loading} />
        </section>
        )}

        {/* Top Rated Section */}
        {data.topRated.length > 0 && (
          <section className="mb-16 md:mb-24">
          <SectionHeader title="Critics Choice" icon={Star} />
          <MovieGrid items={data.topRated} loading={loading} />
        </section>
        )}
        
      </div>
    </div>
  );
};