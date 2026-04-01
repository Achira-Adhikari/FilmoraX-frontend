import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Star,
  Heart,
  Bookmark,
  Share2,
  Plus,
  ChevronRight,
  Timer,
} from "lucide-react";
import { useStore } from "../store/useStore";
 
// Components Imports
import { ActorCard } from "../components/MovieCard";
import { DetailSkeleton } from "../components/LoadingSkeleton";
import { TrailerModal } from "../components/Modal";
import { ReviewCard, ReviewForm } from "../components/ReviewCard";
import { Button } from "../components/Button";
import * as movieService from "../services/movieService";
 
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
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);
 
  const timerComponents = Object.keys(timeLeft).map((interval) => (
    <div key={interval} className="flex flex-col items-center">
      <div className="bg-blue-600/10 border border-blue-500/20 backdrop-blur-md w-12 h-12 flex items-center justify-center rounded-lg">
        <span className="text-lg font-black text-blue-500">
          {timeLeft[interval].toString().padStart(2, "0")}
        </span>
      </div>
      <span className="text-[8px] font-bold uppercase tracking-widest text-gray-500 mt-1">
        {interval}
      </span>
    </div>
  ));
 
  return <div className="flex items-center gap-3 py-2">{timerComponents}</div>;
};
 
export const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
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
    getUserRating,
  } = useStore();
 
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const movieRes = await movieService.getMovieById(id);
 
        setMovie(movieRes.data);
      } catch (error) {
        console.error("Error fetching movie:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    window.scrollTo(0, 0);
  }, [id]);
 
  if (loading) return <DetailSkeleton />;
  if (!movie)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Movie not found
      </div>
    );
 
  // Release status එක පරීක්ෂා කිරීම
  const isUpcoming = movie.release_status === "UPCOMING";
 
  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header Section */}
      <div className="bg-[#1a1a1a] pt-24 pb-8 border-b border-white/5">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <h1 className="text-4xl md:text-6xl font-normal mb-4">
                {movie.title}
              </h1>
              <div className="flex items-center gap-4 text-gray-400 text-sm font-bold">
                <span>{movie.year}</span>
                <span className="border border-gray-700 px-2 py-0.5 rounded text-[10px]">
                  PG-13
                </span>
                <span>{movie.runtime} min</span>
              </div>
            </div>
 
            <div className="flex items-center gap-8">
              <div className="text-right">
                <p className="text-gray-500 text-[10px] font-black tracking-widest uppercase mb-1">
                  CineVault Rating
                </p>
                <div className="flex items-center gap-2">
                  <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
                  <div>
                    <span className="text-2xl font-bold">
                      {movie.averageRating?.toFixed(1) || "0.0"}
                    </span>
                    <span className="text-gray-500">/10</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
 
      <div className="container mx-auto px-4 md:px-8 py-8">
        {/* Visuals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1">
            <img
              src={movie.poster_url_portrait}
              className="w-full h-[450px] object-cover rounded-sm"
              alt={movie.title}
            />
          </div>
          <div
            className="md:col-span-3 relative group cursor-pointer"
            onClick={() => setTrailerOpen(true)}
          >
            <img
              src={movie.poster_url_landscape}
              className="w-full h-[450px] object-cover rounded-sm"
              alt="Backdrop"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/10 transition-all">
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full border-2 border-white/50 flex items-center justify-center backdrop-blur-sm">
                  <Play className="w-8 h-8 fill-white ml-1" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest">
                  Watch Trailer
                </span>
              </div>
            </div>
          </div>
        </div>
 
        {/* Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-10">
          <div className="lg:col-span-2">
            {/* Genre Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {movie.Genre?.map((g) => (
                <span
                  key={g.id}
                  className="px-4 py-1.5 border border-white/10 rounded-full text-xs font-bold bg-white/5 uppercase"
                >
                  {g.name}
                </span>
              ))}
            </div>
 
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-10">
              {movie.synopsis}
            </p>
 
            {/* Production Info */}
            <div className="border-y border-white/5 py-4 space-y-4">
              <div className="flex gap-4">
                <span className="w-24 text-gray-500 font-black uppercase text-[10px]">
                  Director
                </span>
                <span className="text-blue-400 font-bold hover:underline cursor-pointer">
                  {movie.director?.full_name}
                </span>
              </div>
              <div className="flex gap-4">
                <span className="w-24 text-gray-500 font-black uppercase text-[10px]">
                  Status
                </span>
                <span
                  className={`font-bold ${isUpcoming ? "text-yellow-500" : "text-emerald-500"}`}
                >
                  {movie.release_status}
                </span>
              </div>
            </div>
 
            {/* Countdown for Upcoming */}
            {isUpcoming && (
              <div className="mt-10 p-6 bg-blue-600/5 border border-blue-500/10 rounded-sm">
                <div className="flex items-center gap-2 mb-4 text-blue-400">
                  <Timer className="w-4 h-4" />
                  <span className="text-xs font-black uppercase tracking-widest">
                    Release Countdown
                  </span>
                </div>
                <CountdownTimer targetDate={movie.release_date} />
              </div>
            )}
 
            {/* Cast Section */}
            <section className="mt-16">
              <div className="flex items-center gap-3 mb-8 group cursor-pointer">
                <div className="w-1.5 h-8 bg-blue-600 rounded-full" />
                <h2 className="text-3xl font-black uppercase tracking-tighter">
                  Top Cast
                </h2>
                <ChevronRight className="w-6 h-6 text-gray-600 group-hover:text-blue-400" />
              </div>
              <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                {movie.actors?.map((actor) => (
                  <div key={actor.id} className="flex-shrink-0 w-40">
                    <ActorCard actor={actor} />
                  </div>
                ))}
              </div>
            </section>
          </div>
 
          {/* Sidebar */}
          <div className="space-y-6">
            {/* <Button
              onClick={() =>
                isInWatchlist(movie.id)
                  ? removeFromWatchlist(movie.id)
                  : addToWatchlist(movie)
              }
              className={`w-full py-4 rounded-sm font-black uppercase tracking-widest text-xs transition-all ${
                isInWatchlist(movie.id)
                  ? "bg-[#333] text-white"
                  : "bg-blue-600 text-black hover:bg-blue-700"
              }`}
            >
              {isInWatchlist(movie.id) ? (
                <Bookmark className="mr-2 fill-current w-4 h-4" />
              ) : (
                <Plus className="mr-2 w-4 h-4" />
              )}
              {isInWatchlist(movie.id) ? "In Watchlist" : "Add to Watchlist"}
            </Button> */}
 
            {/* Stats */}
            <div className="bg-[#121212] p-6 border border-white/5 space-y-6">
              <div>
                <p className="text-gray-500 text-[10px] mb-2 uppercase font-bold tracking-widest">
                  Type
                </p>
                <p className="text-xl font-bold text-blue-500">
                  {movie.movie_type.replace("_", " ")}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 text-[10px] mb-1 uppercase font-bold">
                    Reviews
                  </p>
                  <p className="text-2xl font-bold">{movie.totalReviews}</p>
                </div>
              </div>
            </div>
 
            <div className="grid grid-cols-2 gap-3">
              {/* <button
                onClick={() =>
                  isInFavorites(movie.id)
                    ? removeFromFavorites(movie.id)
                    : addToFavorites(movie)
                }
                className={`flex items-center justify-center gap-2 w-full p-3 rounded-sm border border-white/5 font-bold text-[10px] uppercase ${isInFavorites(movie.id) ? "text-red-500 bg-red-500/5" : "text-gray-400 bg-white/5"}`}
              >
                <Heart
                  className={`w-4 h-4 ${isInFavorites(movie.id) ? "fill-current" : ""}`}
                />{" "}
                Favorite
              </button> */}
              <button className="flex items-center justify-center gap-2 w-full p-3 rounded-sm border border-white/5 bg-white/5 text-gray-400 font-bold text-[10px] uppercase">
                <Share2 className="w-4 h-4" /> Share
              </button>
            </div>
          </div>
        </div>
      </div>
 
      <TrailerModal
        isOpen={trailerOpen}
        onClose={() => setTrailerOpen(false)}
        trailerUrl={movie.trailer_url}
        title={movie.title}
      />
    </div>
  );
};