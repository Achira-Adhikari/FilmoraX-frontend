import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ActorCard } from "../components/MovieCard";
import { ActorCardSkeleton } from "../components/LoadingSkeleton";
import { getAllActors } from "../services/user/actorService";

export const Actors = () => {
  const [actors, setActors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // useCallback to prevent unnecessary re-creation
  const fetchActors = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getAllActors();

      // safe check
      setActors(res?.data || []);
    } catch (err) {
      console.error("Error fetching actors:", err);
      setError(
        err?.response?.data?.message || "Failed to load actors. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActors();
  }, [fetchActors]);

  return (
    <div className="min-h-screen bg-gray-950 pt-20">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Popular Actors
          </h1>

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {[...Array(12)].map((_, i) => (
                <ActorCardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="text-center text-red-500 py-10">
              <p className="mb-4">{error}</p>
              <button
                onClick={fetchActors}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              >
                Retry
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && actors.length === 0 && (
            <div className="text-center text-gray-400 py-10">
              No actors found.
            </div>
          )}

          {/* Data State */}
          {!loading && !error && actors.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {actors.map((actor) => (
                <ActorCard key={actor.id} actor={actor} />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};