import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: true,
        }),

      logout: () => {
        localStorage.removeItem("auth_token");

        set({
          user: null,
          isAuthenticated: false,
        });

        useStore.persist.clearStorage();
      },
    }),
    {
      name: "auth-storage",
    }
  )
);