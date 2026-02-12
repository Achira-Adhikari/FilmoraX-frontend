import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Calendar, Star, Heart, Bookmark, ChevronDown } from 'lucide-react';
import { api } from '../services/api';
import { useStore } from '../store/useStore';
import { ActorCard } from '../components/MovieCard';
import { DetailSkeleton } from '../components/LoadingSkeleton';
import { TrailerModal } from '../components/Modal';
import { RatingBadge } from '../components/Rating';
import { Button } from '../components/Button';

const EpisodeCard = ({ episode }) => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-colors group">
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h4 className="text-white font-semibold group-hover:text-blue-400 transition-colors">
              {episode.episodeNumber}. {episode.title}
            </h4>
            <div className="flex items-center gap-3 mt-1 text-sm text-gray-400">
              <span>{episode.airDate}</span>
              <span>•</span>
              <span>{episode.runtime} min</span>
              {episode.rating && (
                <>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span>{episode.rating.toFixed(1)}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <p className="text-gray-300 text-sm leading-relaxed">{episode.plot}</p>
      </div>
    </div>
  );
};

const SeasonSection = ({ season, seriesId }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-6 hover:bg-gray-800 transition-colors"
      >
        <div className="flex items-center gap-4">
          <img
            src={season.poster}
            alt={`Season ${season.seasonNumber}`}
            className="w-16 h-24 object-cover rounded"
          />
          <div className="text-left">
            <h3 className="text-xl font-bold text-white">
              Season {season.seasonNumber}
            </h3>
            <p className="text-gray-400 text-sm">
              {season.episodeCount} Episodes • {season.airDate}
            </p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-6 h-6 text-gray-400" />
        </motion.div>
      </button>

      <motion.div
        initial={false}
        animate={{
          height: expanded ? 'auto' : 0,
          opacity: expanded ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="p-6 pt-0 space-y-3">
          {season.episodes && season.episodes.map((episode) => (
            <EpisodeCard key={episode.episodeNumber} episode={episode} />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export const TVDetail = () => {
  const { id } = useParams();
  const [series, setSeries] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trailerOpen, setTrailerOpen] = useState(false);

  const { isAuthenticated, isInWatchlist, isInFavorites, addToWatchlist, removeFromWatchlist, addToFavorites, removeFromFavorites } = useStore();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const seriesRes = await api.tvSeries.getById(id);
        setSeries(seriesRes.data);
      } catch (error) {
        console.error('Error fetching TV series:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  const handleWatchlist = () => {
    if (isInWatchlist(parseInt(id))) {
      removeFromWatchlist(parseInt(id));
    } else {
      addToWatchlist(parseInt(id));
    }
  };

  const handleFavorites = () => {
    if (isInFavorites(parseInt(id))) {
      removeFromFavorites(parseInt(id));
    } else {
      addToFavorites(parseInt(id));
    }
  };

  if (loading) return <DetailSkeleton />;
  if (!series) return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">TV Series not found</div>;

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="relative h-[50vh] md:h-[70vh]">
        <img
          src={series.backdrop}
          alt={series.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/80 to-transparent" />
      </div>

      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:col-span-1"
          >
            <img
              src={series.poster}
              alt={series.title}
              className="w-full rounded-lg shadow-2xl"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-2"
          >
            <div className="inline-block bg-green-600 px-3 py-1 rounded-full text-sm font-semibold text-white mb-3">
              TV SERIES
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {series.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <RatingBadge rating={series.rating} />
              <div className="flex items-center gap-2 text-gray-300">
                <Calendar className="w-4 h-4" />
                <span>{series.year} - {series.endYear || 'Present'}</span>
              </div>
              <div className="text-gray-300">
                {series.totalSeasons} Season{series.totalSeasons !== 1 ? 's' : ''} • {series.totalEpisodes} Episodes
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {series.genres.map((genre) => (
                <span
                  key={genre}
                  className="px-4 py-1 bg-gray-800 text-gray-300 rounded-full text-sm"
                >
                  {genre}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 mb-8">
              <Button
                variant="primary"
                size="lg"
                icon={Play}
                onClick={() => setTrailerOpen(true)}
              >
                Watch Trailer
              </Button>
              {isAuthenticated && (
                <>
                  <Button
                    variant="outline"
                    size="lg"
                    icon={Bookmark}
                    onClick={handleWatchlist}
                    className={isInWatchlist(parseInt(id)) ? 'border-blue-600 text-blue-600' : ''}
                  >
                    Watchlist
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    icon={Heart}
                    onClick={handleFavorites}
                    className={isInFavorites(parseInt(id)) ? 'border-red-600 text-red-600' : ''}
                  >
                    Favorite
                  </Button>
                </>
              )}
            </div>

            <div className="space-y-4 mb-8">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Overview</h3>
                <p className="text-gray-300 leading-relaxed">{series.plot}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 text-sm">Creator</p>
                  <p className="text-white font-medium">{series.creator}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Network</p>
                  <p className="text-white font-medium">{series.network}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Status</p>
                  <p className="text-white font-medium">{series.status}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">First Air Date</p>
                  <p className="text-white font-medium">{series.year}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <section className="mt-16">
          <h2 className="text-3xl font-bold text-white mb-6">Cast</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {series.cast.map((actor) => (
              <ActorCard key={actor.id} actor={actor} />
            ))}
          </div>
        </section>

        <section className="mt-16 pb-16">
          <h2 className="text-3xl font-bold text-white mb-6">Seasons</h2>
          <div className="space-y-4">
            {series.seasons.map((season) => (
              <SeasonSection
                key={season.seasonNumber}
                season={season}
                seriesId={series.id}
              />
            ))}
          </div>
        </section>
      </div>

      <TrailerModal
        isOpen={trailerOpen}
        onClose={() => setTrailerOpen(false)}
        trailerUrl={series.trailer}
        title={series.title}
      />
    </div>
  );
};
