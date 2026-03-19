import { create } from 'zustand';

export const useStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  watchlist: [],
  favorites: [],
  userRatings: [],

  // setUser: (user) => set({
  //   user,
  //   isAuthenticated: !!user,
  //   watchlist: user?.watchlist || [],
  //   favorites: user?.favorites || [],
  //   userRatings: user?.ratings || []
  // }),

  // logout: () => set({
  //   user: null,
  //   isAuthenticated: false,
  //   watchlist: [],
  //   favorites: [],
  //   userRatings: []
  // }),

  setUser: (user) => {
    set({
      user,
      isAuthenticated: true,
    });
  },

  logout: () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");

    set({
      user: null,
      isAuthenticated: false,
    });
  },

  addToWatchlist: (movieId) => set((state) => ({
    watchlist: [...state.watchlist, movieId]
  })),

  removeFromWatchlist: (movieId) => set((state) => ({
    watchlist: state.watchlist.filter(id => id !== movieId)
  })),

  isInWatchlist: (movieId) => {
    return get().watchlist.includes(movieId);
  },

  addToFavorites: (movieId) => set((state) => ({
    favorites: [...state.favorites, movieId]
  })),

  removeFromFavorites: (movieId) => set((state) => ({
    favorites: state.favorites.filter(id => id !== movieId)
  })),

  isInFavorites: (movieId) => {
    return get().favorites.includes(movieId);
  },

  setUserRating: (movieId, rating) => set((state) => {
    const existingRating = state.userRatings.find(r => r.movieId === movieId);
    if (existingRating) {
      return {
        userRatings: state.userRatings.map(r =>
          r.movieId === movieId ? { ...r, rating } : r
        )
      };
    } else {
      return {
        userRatings: [...state.userRatings, { movieId, rating }]
      };
    }
  }),

  getUserRating: (movieId) => {
    return get().userRatings.find(r => r.movieId === movieId)?.rating || null;
  }
}));
