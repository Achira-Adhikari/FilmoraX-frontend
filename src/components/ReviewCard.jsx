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
          src={review.userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.userName}`}
          alt={review.userName}
          className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border border-white/10"
        />
        <div className="flex-1 w-full">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="text-white font-bold tracking-tight text-sm md:text-base">{review.userName}</h4>
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
            {review.content}
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

export const ReviewForm = ({ onSubmit, onCancel, initialRating = 0 }) => {
  const [formData, setFormData] = useState({
    rating: initialRating || 0,
    title: '',
    content: '',
    spoiler: false
  });

  const ratingLabels = {
    10: "Masterpiece", 9: "Amazing", 8: "Great", 7: "Good", 6: "Fine",
    5: "Average", 4: "Boring", 3: "Bad", 2: "Horrible", 1: "Appalling", 0: "Select Rating"
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.rating && formData.content) {
      onSubmit(formData);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="bg-[#1a1a1a] border border-white/10 rounded-sm p-5 md:p-8 space-y-6 md:space-y-8 shadow-2xl w-full"
    >
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <h3 className="text-lg md:text-2xl font-black uppercase tracking-tighter text-white">Write a Review</h3>
        <button type="button" onClick={onCancel} className="text-gray-500 hover:text-white transition-colors">
          <X className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>

      <div className="flex flex-col items-center justify-center py-6 bg-black/20 rounded-sm border border-white/5">
        <p className="text-blue-500 text-[10px] font-black tracking-[0.3em] uppercase mb-2">Your Rating</p>
        <h4 className="text-lg md:text-xl font-bold text-white mb-4 uppercase tracking-tight text-center">
          {ratingLabels[formData.rating]}
        </h4>
        
        <div className="scale-90 md:scale-100">
          <StarRating
            rating={formData.rating}
            readonly={false}
            size="xl"
            color="yellow"
            onChange={(val) => setFormData({ ...formData, rating: val })}
          />
        </div>
        
        <div className="mt-4 flex items-baseline gap-1">
          <span className={`text-3xl md:text-4xl font-black ${formData.rating ? 'text-white' : 'text-gray-800'}`}>
            {formData.rating || '?'}
          </span>
          <span className="text-gray-500 font-bold text-sm md:text-base">/10</span>
        </div>
      </div>

      <div className="space-y-4 md:space-y-6">
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Review Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-[#121212] border border-white/10 text-white rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-blue-400/50 transition-colors"
            placeholder="Main point of your review"
          />
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Your Review *</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full bg-[#121212] border border-white/10 text-white rounded-sm px-4 py-3 h-32 md:h-40 text-sm focus:outline-none focus:border-blue-400/50 transition-colors resize-none"
            placeholder="Write your thoughts here..."
            required
          />
        </div>

        <div className="flex items-start gap-3 p-3 md:p-4 bg-yellow-400/5 rounded-sm border border-yellow-400/10">
          <input
            type="checkbox"
            id="spoiler"
            checked={formData.spoiler}
            onChange={(e) => setFormData({ ...formData, spoiler: e.target.checked })}
            className="w-4 h-4 md:w-5 md:h-5 mt-0.5 rounded border-gray-600 accent-blue-400 cursor-pointer"
          />
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-400 flex-shrink-0" />
            <label htmlFor="spoiler" className="text-gray-300 text-[11px] md:text-sm font-bold cursor-pointer uppercase tracking-tighter leading-tight">
              This review contains spoilers
            </label>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-2">
        <button
          type="submit"
          disabled={!formData.rating || !formData.content}
          className="w-full bg-blue-400 hover:bg-blue-500 disabled:bg-[#333] disabled:text-gray-600 text-black font-black uppercase tracking-widest py-3 md:py-4 rounded-sm transition-all shadow-xl text-xs md:text-sm"
        >
          Submit Review
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="w-full bg-transparent border border-white/10 hover:bg-white/5 text-white font-black uppercase tracking-widest py-3 md:py-4 rounded-sm transition-all text-xs md:text-sm"
        >
          Cancel
        </button>
      </div>
    </motion.form>
  );
};