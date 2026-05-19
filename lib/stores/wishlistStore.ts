import { create } from 'zustand';

interface WishlistStore {
  ids: string[];
  toggle: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  clear: () => void;
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  ids: [],

  toggle: (id: string) => {
    set((state) => {
      const isInWishlist = state.ids.includes(id);
      return {
        ids: isInWishlist
          ? state.ids.filter((productId) => productId !== id)
          : [...state.ids, id],
      };
    });
  },

  isInWishlist: (id: string) => {
    return get().ids.includes(id);
  },

  clear: () => {
    set({ ids: [] });
  },
}));
