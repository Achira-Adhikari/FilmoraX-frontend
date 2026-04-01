import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Play, Calendar, Tv, Layers } from "lucide-react";

export const MovieCard = ({ movie, showRating = true }) => {
  if (!movie) return null;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group relative"
    >
      <Link to={`/movie/${movie.id}`}>
        <div className="relative overflow-hidden rounded-2xl bg-[#0f1115] shadow-2xl border border-white/5">
          {/* Image Section */}
          <div className="aspect-[2/3] relative overflow-hidden">
            <img
              src={movie.poster_url_portrait}
              alt={movie.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:blur-[2px]"
              style={{ backgroundColor: "#16181d" }}
            />

            {/* Dark Premium Play Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
              <div className="relative flex items-center justify-center">
                {/* Outer Animated Ring */}
                <div className="absolute inset-0 rounded-full border border-white/30 scale-150 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-700 ease-out"></div>

                {/* Glass Circle */}
                <div className="h-16 w-16 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl transform scale-75 group-hover:scale-100 transition-transform duration-500">
                  <Play className="w-6 h-6 text-white fill-white ml-1" />
                </div>
              </div>
            </div>

            {/* Rating Tag */}
            {showRating && movie.rating > 0 && (
              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1.5 border border-white/10 shadow-lg">
                <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                <span className="text-white text-[11px] font-black tracking-tight">
                  {movie.rating.toFixed(1)}
                </span>
              </div>
            )}

            {/* Upcoming Label */}
            {movie.release_status === "UPCOMING" && (
              <div className="absolute top-3 left-3 bg-blue-600/80 backdrop-blur-sm px-2 py-0.5 rounded text-[9px] font-bold text-white uppercase tracking-widest border border-white/10">
                New Release
              </div>
            )}

            {/* Not Released Label */}
            {movie.commingsoon && (
              <div className="absolute top-3 left-3 bg-blue-600/80 backdrop-blur-sm px-2 py-0.5 rounded text-[9px] font-bold text-white uppercase tracking-widest border border-white/10">
                Comming Soon
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="p-4 bg-gradient-to-b from-[#16181d] to-[#0f1115]">
            <h3 className="text-gray-100 font-bold text-sm md:text-base truncate group-hover:text-blue-400 transition-colors duration-300">
              {movie.title}
            </h3>

            <div className="flex items-center justify-between mt-2.5">
              <div className="flex items-center gap-1.5 text-gray-500">
                <Calendar className="w-3 h-3" />
                <span className="text-[11px] font-semibold">{movie.year}</span>
              </div>

              {movie.Genre?.[0] && (
                <span className="text-[10px] font-bold text-gray-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md uppercase tracking-tighter">
                  {movie.Genre[0].name}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
export const TVCard = ({ series, showRating = true }) => {
  if (!series) return null;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group relative"
    >
      <Link to={`/tv/${series.id}`}>
        <div className="relative overflow-hidden rounded-2xl bg-[#0f1115] shadow-2xl border border-white/5">
          
          {/* Image Section */}
          <div className="aspect-[2/3] relative overflow-hidden">
            <img
              src={series.poster}
              alt={series.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:blur-[2px]"
              loading="lazy"
              style={{ backgroundColor: '#16181d' }}
            />
            
            {/* Dark Premium Play Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
              <div className="relative flex items-center justify-center">
                {/* Outer Animated Ring */}
                <div className="absolute inset-0 rounded-full border border-white/30 scale-150 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-700 ease-out"></div>
                
                {/* Glass Circle */}
                <div className="h-16 w-16 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl transform scale-75 group-hover:scale-100 transition-transform duration-500">
                  <Play className="w-6 h-6 text-white fill-white ml-1" />
                </div>
              </div>
            </div>

            {/* Rating Tag */}
            {showRating && series.rating > 0 && (
              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1.5 border border-white/10 shadow-lg">
                <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                <span className="text-white text-[11px] font-black tracking-tight">
                  {series.rating.toFixed(1)}
                </span>
              </div>
            )}

            {/* TV Series Badge */}
            <div className="absolute top-3 left-3 bg-emerald-600/80 backdrop-blur-sm px-2 py-1 rounded text-[9px] font-bold text-white uppercase tracking-widest border border-white/10 flex items-center gap-1">
              <Tv className="w-3 h-3" />
              TV Series
            </div>
          </div>

          {/* Info Section */}
          <div className="p-4 bg-gradient-to-b from-[#16181d] to-[#0f1115]">
            <h3 className="text-gray-100 font-bold text-sm md:text-base truncate group-hover:text-blue-400 transition-colors duration-300">
              {series.title}
            </h3>
            
            <div className="flex flex-col gap-1.5 mt-2.5">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-[11px] font-semibold">
                  {series.year}{series.endYear ? ` - ${series.endYear}` : ' - Present'}
                </span>
                
                {series.totalSeasons && (
                  <div className="flex items-center gap-1 text-blue-400/80">
                    <Layers className="w-3 h-3" />
                    <span className="text-[10px] font-bold uppercase tracking-tighter">
                      {series.totalSeasons} {series.totalSeasons === 1 ? 'Season' : 'Seasons'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export const ActorCard = ({ actor }) => {
  if (!actor) return null;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center min-w-[120px] max-w-[140px] group"
    >
      <Link to={`/actor/${actor.id}`} className="flex flex-col items-center w-full">
        
        {/* Circular Image Container */}
        <div className="relative w-24 h-24 md:w-32 md:h-32 mb-3">
          <div className="w-full h-full rounded-full overflow-hidden border-2 border-transparent group-hover:border-blue-500 transition-all duration-300 shadow-xl">
            <img
              src={actor.image_url}
              alt={actor.full_name}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              style={{ backgroundColor: '#1a1c20' }}
            />
          </div>
          
          {/* Subtle Glow behind circle on hover */}
          <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
        </div>

        {/* Text Section */}
        <div className="text-center w-full px-1">
          <h3 className="text-gray-100 font-bold text-xs md:text-sm line-clamp-2 group-hover:text-blue-400 transition-colors duration-300">
            {actor.full_name}
          </h3>
          
          {actor.character && (
            <p className="text-gray-500 text-[10px] md:text-xs mt-1 line-clamp-2 italic leading-tight">
              {actor.character}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
};
