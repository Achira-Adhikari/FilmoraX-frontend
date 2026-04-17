import { motion } from 'framer-motion';
import { ThumbsUp, AlertTriangle, Star, X, Info } from 'lucide-react';
import { useState } from 'react';
import { StarRating } from '../components/Rating'; 

export const ReviewCard = ({ review, onMarkHelpful }) => {
  const [helpful, setHelpful] = useState(review.helpful || 0);
  const [hasVoted, setHasVoted] = useState(false);

  const handleHelpful = () => {
    if (!hasVoted) {
      setHelpful(helpful + 1);
      setHasVoted(true);
      onMarkHelpful && onMarkHelpful(review.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#121212] border border-white/5 rounded-sm p-4 md:p-6 hover:bg-[#1a1a1a] transition-colors"
    >
      <div className="flex flex-col sm:flex-row items-start gap-4">
        <img
          src={review.userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.user.full_name}`}
          alt={review.user.full_name}
          className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border border-white/10"
        />
        <div className="flex-1 w-full">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="text-white font-bold tracking-tight text-sm md:text-base">{review.user.full_name}</h4>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-white text-[10px] md:text-xs font-black">{review.rating}/10</span>
                </div>
                <span className="text-gray-600 text-xs">•</span>
                <span className="text-gray-500 text-[10px] md:text-xs uppercase font-bold">{review.date}</span>
              </div>
            </div>
            {review.spoiler && (
              <div className="flex items-center gap-1 px-1.5 py-0.5 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-[8px] md:text-[10px] font-black uppercase tracking-widest">
                <AlertTriangle className="w-2.5 h-2.5 md:w-3 md:h-3" />
                <span>Spoiler</span>
              </div>
            )}
          </div>

          {review.title && (
            <h5 className="text-sm md:text-md font-bold text-white mb-2 leading-snug">{review.title}</h5>
          )}

          <p className="text-gray-400 text-xs md:text-sm leading-relaxed mb-4">
            {review.comment}
          </p>

          <div className="flex items-center gap-4 border-t border-white/5 pt-4">
            <button
              onClick={handleHelpful}
              className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors ${
                hasVoted
                  ? 'text-blue-400'
                  : 'text-gray-500 hover:text-blue-400'
              }`}
              disabled={hasVoted}
            >
              <ThumbsUp className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span>Helpful ({helpful})</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const ReviewForm = ({ movieId, onSubmit, onCancel, initialRating = 0 }) => {
  const [formData, setFormData] = useState({
    rating: initialRating || 0,
    comment: "",
  });

  const ratingLabels = {
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
    0: "Select Rating",
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.rating || !formData.comment.trim()) return;

    const payload = {
      movieId: Number(movieId),
      rating: formData.rating,
      comment: formData.comment,
    };

    onSubmit(payload);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="bg-[#1a1a1a] border border-white/10 rounded-sm p-6 space-y-8 shadow-2xl w-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <h3 className="text-xl font-black uppercase text-white">
          Write a Review
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-500 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Rating Section */}
      <div className="flex flex-col items-center py-6 bg-black/20 rounded-sm border border-white/5">
        <p className="text-blue-500 text-[10px] font-black tracking-[0.3em] uppercase mb-2">
          Your Rating
        </p>

        <h4 className="text-lg font-bold text-white mb-4 uppercase">
          {ratingLabels[Math.round(formData.rating)]}
        </h4>

        <StarRating
          rating={formData.rating}
          readonly={false}
          size="xl"
          color="yellow"
          onChange={(val) =>
            setFormData((prev) => ({ ...prev, rating: val }))
          }
        />

        <div className="mt-4 flex items-baseline gap-1">
          <span className="text-4xl font-black text-white">
            {formData.rating || "?"}
          </span>
          <span className="text-gray-500 font-bold">/10</span>
        </div>
      </div>

      {/* Comment Section */}
      <div>
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
          Your Review *
        </label>
        <textarea
          value={formData.comment}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, comment: e.target.value }))
          }
          className="w-full bg-[#121212] border border-white/10 text-white rounded-sm px-4 py-3 h-32 text-sm focus:outline-none focus:border-blue-400/50 transition-colors resize-none"
          placeholder="Write your thoughts here..."
          required
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-3">
        <button
          type="submit"
          disabled={!formData.rating || !formData.comment.trim()}
          className="w-full bg-blue-400 hover:bg-blue-500 disabled:bg-[#333] disabled:text-gray-600 text-black font-black uppercase py-3 rounded-sm transition-all"
        >
          Submit Review
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="w-full border border-white/10 hover:bg-white/5 text-white font-black uppercase py-3 rounded-sm transition-all"
        >
          Cancel
        </button>
      </div>
    </motion.form>
  );
};