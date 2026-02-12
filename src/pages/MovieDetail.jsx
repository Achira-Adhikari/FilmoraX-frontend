import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Calendar,
  Clock,
  Star,
  Heart,
  Bookmark,
  Share2,
  Plus,
  ChevronRight,
  Timer,
} from "lucide-react";
import { api } from "../services/api";
import { useStore } from "../store/useStore";

// Components Imports
import { ActorCard, MovieCard } from "../components/MovieCard";
import { DetailSkeleton } from "../components/LoadingSkeleton";
import { TrailerModal } from "../components/Modal";
import { RatingBadge, UserRatingInput } from "../components/Rating";
import { ReviewCard, ReviewForm } from "../components/ReviewCard";
import { Button } from "../components/Button";

// --- Countdown Component ---
const CountdownTimer = ({ targetDate }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const timerComponents = Object.keys(timeLeft).map((interval) => {
    if (!timeLeft[interval] && timeLeft[interval] !== 0) return null;

    return (
      <div key={interval} className="flex flex-col items-center">
        <div className="bg-blue-600/10 border border-blue-500/20 backdrop-blur-md w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-lg">
          <span className="text-lg md:text-2xl font-black text-blue-500">
            {timeLeft[interval].toString().padStart(2, '0')}
          </span>
        </div>
        <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-gray-500 mt-1">
          {interval}
        </span>
      </div>
    );
  });

  return (
    <div className="flex items-center gap-3 md:gap-4 py-2">
      {timerComponents.length ? timerComponents : (
        <span className="text-emerald-500 font-bold">RELEASED</span>
      )}
    </div>
  );
};

// --- Main MovieDetail Component ---
export const MovieDetail = () => {
  const { id } = useParams();
  const movieId = parseInt(id);

  const [movie, setMovie] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const {
    isAuthenticated,
    isInWatchlist,
    isInFavorites,
    addToWatchlist,
    removeFromWatchlist,
    addToFavorites,
    removeFromFavorites,
    setUserRating,
    getUserRating,
  } = useStore();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [movieRes, similarRes, reviewsRes] = await Promise.all([
          api.movies.getById(id),
          api.movies.getSimilar(id),
          api.reviews.getByMovie(id),
        ]);

        setMovie(movieRes.data);
        setSimilar(similarRes.data || []);
        setReviews(reviewsRes.data || []);
      } catch (error) {
        console.error("Error fetching movie:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  const handleWatchlist = () => {
    isInWatchlist(movieId)
      ? removeFromWatchlist(movieId)
      : addToWatchlist(movie);
  };

  const handleFavorites = () => {
    isInFavorites(movieId)
      ? removeFromFavorites(movieId)
      : addToFavorites(movie);
  };

  const handleRate = async (rating) => {
    setUserRating(movieId, rating);
    await api.user.rateMovie(movieId, rating);
  };

  const handleReviewSubmit = async (reviewData) => {
    try {
      await api.reviews.create({ ...reviewData, movieId: movieId });
      if (reviewData.rating > 0) {
        handleRate(reviewData.rating);
      }
      const reviewsRes = await api.reviews.getByMovie(id);
      setReviews(reviewsRes.data);
      setShowReviewForm(false);
    } catch (error) {
      console.error("Failed to submit review and rating:", error);
    }
  };

  const handleMarkHelpful = async (reviewId) => {
    const updatedReview = await api.reviews.markHelpful(reviewId);
    setReviews(
      reviews.map((r) => (r.id === reviewId ? updatedReview.data : r)),
    );
  };

  if (loading) return <DetailSkeleton />;
  if (!movie) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Movie not found</div>;

  // Check if movie is upcoming
  const isUpcoming = movie.upcoming || movie.commingsoon || movie.status === "In Production";

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* IMDb Style Top Bar */}
      <div className="bg-[#1f1f1f] pt-20 pb-6 border-b border-white/5">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                 {isUpcoming && (
                    <span className="bg-yellow-500 text-black text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-tighter">
                      Coming Soon
                    </span>
                 )}
              </div>
              <h1 className="text-3xl md:text-5xl font-normal mb-3 leading-tight">
                {movie.title}
              </h1>
              <div className="flex items-center gap-3 text-gray-400 text-xs md:text-sm font-medium">
                <span>{movie.year}</span>
                <span className="border border-gray-600 px-1.5 py-0.5 text-[10px] rounded uppercase">
                  {isUpcoming ? "TBA" : "PG-13"}
                </span>
                <span>{movie.runtime > 0 ? `${movie.runtime} min` : "Runtime TBA"}</span>
              </div>
            </div>

            <div className="flex items-center gap-8">
              {!isUpcoming && (
                <div className="flex flex-col items-start md:items-center">
                  <p className="text-gray-500 text-[10px] font-black tracking-widest mb-1 uppercase">IMDb Rating</p>
                  <div className="flex items-center gap-2">
                    <Star className="w-6 h-6 md:w-8 md:h-8 text-yellow-400 fill-yellow-500" />
                    <div>
                      <span className="text-xl md:text-2xl font-bold">{movie.rating?.toFixed(1)}</span>
                      <span className="text-gray-500 text-sm">/10</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-4 md:py-8">
        {/* Visuals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4">
          <div className="md:col-span-1 hidden md:block">
            <img src={movie.poster} className="w-full h-[500px] object-cover rounded-sm shadow-2xl" alt={movie.title} />
          </div>
          <div className="md:col-span-3 relative group cursor-pointer" onClick={() => setTrailerOpen(true)}>
            <img src={movie.backdrop} className="w-full h-[220px] sm:h-[300px] md:h-[500px] object-cover rounded-sm" alt="Backdrop" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-all">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-white/60 flex items-center justify-center backdrop-blur-sm">
                  <Play className="w-6 h-6 md:w-8 md:h-8 fill-white ml-1" />
                </div>
                <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">Watch Trailer</span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 mt-6 md:mt-10">
          <div className="lg:col-span-2">
            
            {/* Countdown Section for Upcoming Movies */}
            {isUpcoming && (
              <div className="mb-10 p-6 bg-blue-600/5 border border-blue-500/10 rounded-sm">
                <div className="flex items-center gap-2 mb-4 text-blue-400">
                  <Timer className="w-4 h-4" />
                  <span className="text-xs font-black uppercase tracking-[0.2em]">Release Countdown</span>
                </div>
                <CountdownTimer targetDate={movie.releaseDate} />
                <p className="mt-4 text-xs text-gray-500 font-bold uppercase">
                  Expected Release: {new Date(movie.releaseDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            )}

            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genres?.map((g) => (
                <span key={g} className="px-4 py-1.5 border border-white/10 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-tighter bg-white/5">
                  {g}
                </span>
              ))}
            </div>

            <p className="text-base md:text-xl text-gray-300 leading-relaxed mb-8 md:mb-10">{movie.plot}</p>

            <div className="border-y border-white/5 py-4 space-y-4">
              <div className="flex gap-4">
                <span className="w-20 md:w-24 text-gray-500 font-black uppercase text-[10px]">Director</span>
                <span className="text-blue-400 font-bold hover:underline cursor-pointer text-sm md:text-base">{movie.director}</span>
              </div>
              <div className="flex gap-4">
                <span className="w-20 md:w-24 text-gray-500 font-black uppercase text-[10px]">Status</span>
                <span className={`font-bold text-sm md:text-base ${isUpcoming ? "text-yellow-500" : "text-emerald-500"}`}>
                  {movie.status}
                </span>
              </div>
            </div>

            {/* Cast Section */}
            <section className="mt-12 md:mt-16">
              <div className="flex items-center gap-3 mb-6 group cursor-pointer">
                <div className="w-1 h-6 md:w-1.5 md:h-8 bg-blue-600 rounded-full" />
                <h2 className="text-2xl md:text-3xl font-black group-hover:text-blue-400 transition-colors uppercase tracking-tighter">Top Cast</h2>
                <ChevronRight className="w-6 h-6 text-gray-600 group-hover:text-blue-400" />
              </div>
              <div className="flex gap-4 md:gap-6 overflow-x-auto pb-6 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                {movie.cast?.map((actor) => (
                  <div key={actor.id} className="flex-shrink-0 w-28 md:w-40 pt-2">
                    <ActorCard actor={actor} />
                  </div>
                ))}
              </div>
            </section>

            {/* Reviews Section */}
            {!isUpcoming && (
              <section className="mt-12 md:mt-16 pt-12 border-t border-white/5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-6 bg-blue-600 rounded-full" />
                    <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">User reviews</h2>
                    <span className="text-gray-600 text-lg font-bold">{reviews.length}</span>
                  </div>
                  {isAuthenticated && !showReviewForm && (
                    <Button onClick={() => setShowReviewForm(true)} className="bg-transparent border border-white/20 hover:bg-white/5 text-[10px] px-6 py-2 rounded-full font-bold w-fit">
                      + Write Review
                    </Button>
                  )}
                </div>

                <AnimatePresence>
                  {showReviewForm && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-10">
                      <ReviewForm onSubmit={handleReviewSubmit} onCancel={() => setShowReviewForm(false)} initialRating={getUserRating(movieId)} />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-4">
                  {reviews.length > 0 ? (
                    reviews.map((review) => <ReviewCard key={review.id} review={review} onMarkHelpful={handleMarkHelpful} />)
                  ) : (
                    <div className="text-center py-12 bg-[#121212] rounded-sm border border-dashed border-white/10">
                      <p className="text-gray-500 italic text-sm">No reviews yet. Be the first to review!</p>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4 md:space-y-6">
            <Button
              onClick={handleWatchlist}
              className={`w-full py-4 rounded-sm font-black uppercase tracking-widest text-xs md:text-sm transition-all ${
                isInWatchlist(movieId) ? "bg-[#333] text-white border border-white/10" : "bg-blue-600 text-black hover:bg-blue-700"
              }`}
            >
              {isInWatchlist(movieId) ? <Bookmark className="mr-2 fill-current w-4 h-4" /> : <Plus className="mr-2 w-4 h-4" />}
              {isInWatchlist(movieId) ? "In Watchlist" : "Add to Watchlist"}
            </Button>

            {!isUpcoming && (
              <div className="bg-[#121212] p-5 md:p-6 border border-white/5 space-y-6 rounded-sm">
                <h3 className="text-gray-500 font-black uppercase text-[10px] tracking-widest">Box Office</h3>
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                  <div>
                    <p className="text-gray-500 text-[10px] mb-1 uppercase font-bold">Budget</p>
                    <p className="text-xl md:text-2xl font-bold tracking-tighter">
                      {movie.budget > 0 ? `$${(movie.budget / 1000000).toFixed(0)}M` : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-[10px] mb-1 uppercase font-bold">Gross Worldwide</p>
                    <p className="text-xl md:text-2xl font-bold tracking-tighter text-emerald-400">
                      {movie.revenue > 0 ? `$${(movie.revenue / 1000000).toFixed(0)}M` : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
              <button
                onClick={handleFavorites}
                className={`flex items-center justify-center gap-2 w-full p-3 rounded-sm border border-white/5 font-bold text-[10px] uppercase transition-all ${
                  isInFavorites(movieId) ? "text-red-500 bg-red-500/5 border-red-500/20" : "text-gray-400 bg-white/5 hover:bg-white/10"
                }`}
              >
                <Heart className={`w-4 h-4 ${isInFavorites(movieId) ? "fill-current" : ""}`} /> Favorite
              </button>
              <button className="flex items-center justify-center gap-2 w-full p-3 rounded-sm border border-white/5 bg-white/5 hover:bg-white/10 text-gray-400 font-bold text-[10px] uppercase transition-all">
                <Share2 className="w-4 h-4" /> Share
              </button>
            </div>
          </div>
        </div>
      </div>

      <TrailerModal
        isOpen={trailerOpen}
        onClose={() => setTrailerOpen(false)}
        trailerUrl={movie.trailer}
        title={movie.title}
      />
    </div>
  );
};