import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  purity?: string;
  size: number;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  add: (item: CartItem) => void;
  remove: (productId: string, config?: Partial<CartItem>) => void;
  updateQty: (productId: string, qty: number, config?: Partial<CartItem>) => void;
  clear: () => void;
  isInCart: (productId: string) => boolean;
  total: () => number;
  setOpen: (open: boolean) => void;
}

// Helper function to check if two items have matching configurations
const itemsMatch = (item1: CartItem, item2: CartItem): boolean => {
  return (
    item1.productId === item2.productId &&
    item1.purity === item2.purity &&
    item1.size === item2.size
  );
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      add: (item: CartItem) => {
        set((state) => {
          // Find existing item with matching productId AND configuration
          const existing = state.items.find((i) => itemsMatch(i, item));

          if (existing) {
            return {
              items: state.items.map((i) =>
                itemsMatch(i, item)
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }

          return {
            items: [...state.items, item],
          };
        });
      },

      remove: (productId: string, config?: Partial<CartItem>) => {
        set((state) => ({
          items: state.items.filter((i) => {
            if (i.productId !== productId) return true;
            if (!config) return false; // If no config provided, remove all with this productId

            // If config provided, only remove matching configuration
            return !(
              (config.metal === undefined || i.metal === config.metal) &&
              (config.purity === undefined || i.purity === config.purity) &&
              (config.carat === undefined || i.carat === config.carat) &&
              (config.size === undefined || i.size === config.size)
            );
          }),
        }));
      },

      updateQty: (productId: string, qty: number, config?: Partial<CartItem>) => {
        if (qty <= 0) {
          get().remove(productId, config);
          return;
        }
        set((state) => ({
          items: state.items.map((i) => {
            if (i.productId !== productId) return i;
            if (config && !itemsMatch(i, { ...i, ...config } as CartItem)) return i;
            return { ...i, quantity: qty };
          }),
        }));
      },

      clear: () => {
        set({ items: [] });
      },

      isInCart: (productId: string) => {
        return get().items.some((i) => i.productId === productId);
      },

      total: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      setOpen: (open: boolean) => {
        set({ isOpen: open });
      },
    }),
    {
      name: 'cart-store',
      partialize: (state) => ({
        items: state.items,
      }),
    }
  )
);
