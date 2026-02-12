import { useState } from 'react';
import { Star, X } from 'lucide-react';
import { motion } from 'framer-motion';

// --- StarRating: තරු 10 ක් පෙන්වන ප්‍රධාන Component එක ---
export const StarRating = ({ rating, maxRating = 10, size = 'md', readonly = true, onChange, color = "yellow" }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8'
  };

  const starCount = 10; // IMDb style තරු 10 ක්
  const displayRating = hoverRating || rating;
  
  // පාට තීරණය කිරීම (Yellow for general, Blue for user)
  const activeColor = color === "yellow" ? "fill-yellow-400 text-yellow-400" : "fill-blue-500 text-blue-500";

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(starCount)].map((_, index) => {
        const starValue = index + 1;
        const isActive = starValue <= displayRating;

        return (
          <motion.button
            key={index}
            whileHover={readonly ? {} : { scale: 1.3, zIndex: 10 }}
            whileTap={readonly ? {} : { scale: 0.9 }}
            className={`relative p-0.5 ${readonly ? 'cursor-default' : 'cursor-pointer'}`}
            onClick={() => !readonly && onChange && onChange(starValue)}
            onMouseEnter={() => !readonly && setHoverRating(starValue)}
            onMouseLeave={() => !readonly && setHoverRating(0)}
            disabled={readonly}
          >
            <Star 
              className={`${sizes[size]} transition-colors duration-200 ${
                isActive ? activeColor : 'text-gray-600 fill-transparent'
              }`} 
            />
          </motion.button>
        );
      })}
    </div>
  );
};

// --- RatingBadge: Movie Cards වල පෙන්වන පොඩි badge එක ---
export const RatingBadge = ({ rating, maxRating = 10 }) => {
  return (
    <div className="bg-black/60 backdrop-blur-md px-2 py-1 rounded border border-white/10 inline-flex items-center gap-1.5">
      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
      <span className="text-white font-black text-xs">
        {rating > 0 ? rating.toFixed(1) : 'N/A'}
      </span>
    </div>
  );
};

// --- UserRatingInput: Review Form එකේ සහ Movie Detail එකේ පාවිච්චි කරන එක ---
export const UserRatingInput = ({ currentRating, onRate }) => {
  const [selectedRating, setSelectedRating] = useState(currentRating || 0);

  const handleRate = (rating) => {
    setSelectedRating(rating);
    onRate(rating);
  };

  const labels = {
    10: "Masterpiece",
    9: "Amazing",
    8: "Great",
    7: "Good",
    6: "Fine",
    5: "Average",
    4: "Boring",
    3: "Bad",
    2: "Horrible",
    1: "Appalling",
    0: "Rate this movie"
  };

  return (
    <div className="bg-[#1a1a1a] rounded-sm p-8 border border-white/5 shadow-2xl">
      <div className="flex flex-col items-center gap-6">
        {/* Rating Label */}
        <div className="text-center">
          <p className="text-yellow-500 text-[10px] font-black tracking-[0.3em] uppercase mb-2">Your Rating</p>
          <h3 className="text-2xl font-black text-white uppercase tracking-tighter">
            {labels[Math.round(selectedRating)]}
          </h3>
        </div>

        {/* 10 Star Input */}
        <StarRating
          rating={selectedRating}
          readonly={false}
          size="xl"
          color="yellow" // User rating එක නිල් පාටින්
          onChange={handleRate}
        />

        {/* Display Value */}
        <div className="flex flex-col items-center">
          <div className="flex items-baseline gap-1">
            <span className={`text-5xl font-black tracking-tighter ${selectedRating ? 'text-white' : 'text-gray-700'}`}>
              {selectedRating || '?'}
            </span>
            <span className="text-gray-500 font-bold">/10</span>
          </div>
          
          {selectedRating > 0 && (
            <button 
              onClick={() => handleRate(0)}
              className="mt-4 text-[10px] text-gray-500 hover:text-white font-black uppercase tracking-widest transition-colors flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
};