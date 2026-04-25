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
          justLoggedOut: false,
        }),

        updateUser: (updatedFields) =>
        set((state) => ({
          user: {
            ...state.user,
            ...updatedFields,
          },
        })),

      logout: () => {
        localStorage.removeItem("auth_token");

        set({
          user: null,
          isAuthenticated: false,
          justLoggedOut: true,
        });

        useStore.persist.clearStorage();
      },
    }),
    {
      name: "auth-storage",
    }
  )
);