import {
  movies,
  tvSeries,
  actors,
  reviews,
  genres,
  mockUser,
  adminStats,
} from "../data/mockData";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
  movies: {
    getAll: async () => {
      await delay(500);
      return { data: movies };
    },

    getById: async (id) => {
      await delay(300);
      const movie = movies.find((m) => m.id === parseInt(id));
      if (!movie) throw new Error("Movie not found");
      return { data: movie };
    },

    getTrending: async () => {
      await delay(400);
      return { data: movies.filter((m) => m.trending) };
    },

    getPopular: async () => {
      await delay(400);
      return { data: movies.filter((m) => m.popular) };
    },

    getTopRated: async () => {
      await delay(400);
      return { data: movies.filter((m) => m.topRated) };
    },

    getUpcoming: async () => {
      await delay(400);
      return { data: movies.filter((m) => m.upcoming) };
    },

    getComingsoon: async () => {
      await delay(400);
      return { data: movies.filter((m) => m.commingsoon) };
    },

    getSimilar: async (id) => {
      await delay(300);
      const movie = movies.find((m) => m.id === parseInt(id));
      if (!movie) return { data: [] };
      return {
        data: movies
          .filter(
            (m) =>
              m.id !== parseInt(id) &&
              m.genres.some((g) => movie.genres.includes(g)),
          )
          .slice(0, 6),
      };
    },

    search: async (query, filters = {}) => {
      await delay(500);
      let results = movies;

      if (query) {
        results = results.filter(
          (m) =>
            m.title.toLowerCase().includes(query.toLowerCase()) ||
            m.plot.toLowerCase().includes(query.toLowerCase()),
        );
      }

      if (filters.genre) {
        results = results.filter((m) => m.genres.includes(filters.genre));
      }

      if (filters.year) {
        results = results.filter((m) => m.year === parseInt(filters.year));
      }

      if (filters.minRating) {
        results = results.filter(
          (m) => m.rating >= parseFloat(filters.minRating),
        );
      }

      return { data: results };
    },

    create: async (movieData) => {
      await delay(600);
      const newMovie = {
        id: movies.length + 1,
        ...movieData,
        rating: 0,
        cast: [],
        trending: false,
        popular: false,
        topRated: false,
      };
      return { data: newMovie };
    },

    update: async (id, movieData) => {
      await delay(600);
      const movie = movies.find((m) => m.id === parseInt(id));
      if (!movie) throw new Error("Movie not found");
      return { data: { ...movie, ...movieData } };
    },

    delete: async (id) => {
      await delay(500);
      return { success: true };
    },
  },

  tvSeries: {
    getAll: async () => {
      await delay(500);
      return { data: tvSeries };
    },

    getById: async (id) => {
      await delay(300);
      const series = tvSeries.find((s) => s.id === parseInt(id));
      if (!series) throw new Error("TV Series not found");
      return { data: series };
    },

    getTrending: async () => {
      await delay(400);
      return { data: tvSeries.filter((s) => s.trending) };
    },

    getPopular: async () => {
      await delay(400);
      return { data: tvSeries.filter((s) => s.popular) };
    },

    getTopRated: async () => {
      await delay(400);
      return { data: tvSeries.filter((s) => s.topRated) };
    },

    getSeason: async (seriesId, seasonNumber) => {
      await delay(300);
      const series = tvSeries.find((s) => s.id === parseInt(seriesId));
      if (!series) throw new Error("TV Series not found");
      const season = series.seasons.find(
        (s) => s.seasonNumber === parseInt(seasonNumber),
      );
      if (!season) throw new Error("Season not found");
      return { data: season };
    },

    search: async (query, filters = {}) => {
      await delay(500);
      let results = tvSeries;

      if (query) {
        results = results.filter(
          (s) =>
            s.title.toLowerCase().includes(query.toLowerCase()) ||
            s.plot.toLowerCase().includes(query.toLowerCase()),
        );
      }

      if (filters.genre) {
        results = results.filter((s) => s.genres.includes(filters.genre));
      }

      if (filters.year) {
        results = results.filter((s) => s.year === parseInt(filters.year));
      }

      return { data: results };
    },

    create: async (seriesData) => {
      await delay(600);
      const newSeries = {
        id: tvSeries.length + 1,
        ...seriesData,
        rating: 0,
        seasons: seriesData.seasons || [],
        trending: false,
        popular: false,
        topRated: false,
      };
      return { data: newSeries };
    },

    update: async (id, seriesData) => {
      await delay(600);
      const series = tvSeries.find((s) => s.id === parseInt(id));
      if (!series) throw new Error("TV Series not found");
      return { data: { ...series, ...seriesData } };
    },

    delete: async (id) => {
      await delay(500);
      return { success: true };
    },
  },

  actors: {
    getAll: async () => {
      await delay(500);
      return { data: actors };
    },

    getById: async (id) => {
      await delay(300);
      const actor = actors.find((a) => a.id === parseInt(id));
      if (!actor) throw new Error("Actor not found");
      return { data: actor };
    },

    search: async (query) => {
      await delay(400);
      return {
        data: actors.filter((a) =>
          a.name.toLowerCase().includes(query.toLowerCase()),
        ),
      };
    },

    create: async (actorData) => {
      await delay(600);
      const newActor = {
        id: actors.length + 1,
        ...actorData,
        filmography: [],
      };
      return { data: newActor };
    },

    update: async (id, actorData) => {
      await delay(600);
      const actor = actors.find((a) => a.id === parseInt(id));
      if (!actor) throw new Error("Actor not found");
      return { data: { ...actor, ...actorData } };
    },

    delete: async (id) => {
      await delay(500);
      return { success: true };
    },
  },

  reviews: {
    getByMovie: async (movieId) => {
      await delay(400);
      return {
        data: reviews.filter((r) => r.movieId === parseInt(movieId)),
      };
    },

    create: async (reviewData) => {
      await delay(500);
      const newReview = {
        id: reviews.length + 1,
        ...reviewData,
        date: new Date().toISOString().split("T")[0],
        helpful: 0,
        userAvatar: mockUser.avatar,
        userName: mockUser.name,
      };
      return { data: newReview };
    },

    update: async (id, reviewData) => {
      await delay(500);
      const review = reviews.find((r) => r.id === parseInt(id));
      if (!review) throw new Error("Review not found");
      return { data: { ...review, ...reviewData } };
    },

    delete: async (id) => {
      await delay(400);
      return { success: true };
    },

    markHelpful: async (id) => {
      await delay(300);
      const review = reviews.find((r) => r.id === parseInt(id));
      if (!review) throw new Error("Review not found");
      return { data: { ...review, helpful: review.helpful + 1 } };
    },
  },

  user: {
    getCurrent: async () => {
      await delay(300);
      return { data: mockUser };
    },

    login: async (email, password) => {
      await delay(800);
      return {
        data: mockUser,
        token: "mock-jwt-token-" + Date.now(),
      };
    },

    googleLogin: async () => {
      await delay(1000);
      return {
        data: mockUser,
        token: "mock-jwt-token-google-" + Date.now(),
      };
    },

    updateProfile: async (userData) => {
      await delay(600);
      return { data: { ...mockUser, ...userData } };
    },

    getWatchlist: async () => {
      await delay(400);
      return {
        data: movies.filter((m) => mockUser.watchlist.includes(m.id)),
      };
    },

    addToWatchlist: async (movieId) => {
      await delay(300);
      return { success: true };
    },

    removeFromWatchlist: async (movieId) => {
      await delay(300);
      return { success: true };
    },

    getFavorites: async () => {
      await delay(400);
      return {
        data: movies.filter((m) => mockUser.favorites.includes(m.id)),
      };
    },

    addToFavorites: async (movieId) => {
      await delay(300);
      return { success: true };
    },

    removeFromFavorites: async (movieId) => {
      await delay(300);
      return { success: true };
    },

    rateMovie: async (movieId, rating) => {
      await delay(400);
      return { success: true, data: { movieId, rating } };
    },
  },

  admin: {
    getStats: async () => {
      await delay(500);
      return { data: adminStats };
    },

    getRecentReviews: async () => {
      await delay(400);
      return { data: reviews.slice(0, 10) };
    },
  },

  genres: {
    getAll: async () => {
      await delay(200);
      return { data: genres };
    },
  },
};
