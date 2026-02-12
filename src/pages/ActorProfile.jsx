import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Film, Tv } from 'lucide-react';
import { api } from '../services/api';
import { MovieCard } from '../components/MovieCard';
import { DetailSkeleton } from '../components/LoadingSkeleton';

export const ActorProfile = () => {
  const { id } = useParams();
  const [actor, setActor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const actorRes = await api.actors.getById(id);
        setActor(actorRes.data);
      } catch (error) {
        console.error('Error fetching actor:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <DetailSkeleton />;
  if (!actor) return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">Actor not found</div>;

  const movies = actor.filmography?.filter(f => f.type === 'movie') || [];
  const tvShows = actor.filmography?.filter(f => f.type === 'tv') || [];

  return (
    <div className="min-h-screen bg-gray-950 pt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:col-span-1"
          >
            <img
              src={actor.image}
              alt={actor.name}
              className="w-full rounded-lg shadow-2xl mb-6"
            />

            <div className="bg-gray-900 rounded-lg p-6 space-y-4">
              <h3 className="text-xl font-bold text-white">Personal Info</h3>

              <div>
                <p className="text-gray-500 text-sm mb-1">Known For</p>
                <p className="text-white font-medium">{actor.knownFor}</p>
              </div>

              {actor.birthDate && (
                <div>
                  <p className="text-gray-500 text-sm mb-1">Date of Birth</p>
                  <div className="flex items-center gap-2 text-white">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(actor.birthDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">
                    {new Date().getFullYear() - new Date(actor.birthDate).getFullYear()} years old
                  </p>
                </div>
              )}

              {actor.birthPlace && (
                <div>
                  <p className="text-gray-500 text-sm mb-1">Place of Birth</p>
                  <div className="flex items-center gap-2 text-white">
                    <MapPin className="w-4 h-4" />
                    <span>{actor.birthPlace}</span>
                  </div>
                </div>
              )}

              <div>
                <p className="text-gray-500 text-sm mb-1">Known Credits</p>
                <p className="text-white font-medium">{actor.filmography?.length || 0}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-2"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {actor.name}
            </h1>

            <div className="bg-gray-900 rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Biography</h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {actor.bio}
              </p>
            </div>

            {movies.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-6">
                  <Film className="w-6 h-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-white">Movies</h2>
                  <span className="text-gray-400">({movies.length})</span>
                </div>
                <div className="space-y-3">
                  {movies.map((credit) => (
                    <div
                      key={credit.id}
                      className="bg-gray-900 rounded-lg p-4 hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-white font-semibold text-lg">{credit.title}</h3>
                          <p className="text-gray-400 text-sm">as {credit.character}</p>
                        </div>
                        <span className="text-gray-500 font-medium">{credit.year}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tvShows.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Tv className="w-6 h-6 text-green-600" />
                  <h2 className="text-2xl font-bold text-white">TV Shows</h2>
                  <span className="text-gray-400">({tvShows.length})</span>
                </div>
                <div className="space-y-3">
                  {tvShows.map((credit) => (
                    <div
                      key={credit.id}
                      className="bg-gray-900 rounded-lg p-4 hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-white font-semibold text-lg">{credit.title}</h3>
                          <p className="text-gray-400 text-sm">as {credit.character}</p>
                        </div>
                        <span className="text-gray-500 font-medium">{credit.year}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
