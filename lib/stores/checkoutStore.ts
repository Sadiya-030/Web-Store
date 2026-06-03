import { create } from "zustand";

export interface AddressFormData {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pinCode: string;
  saveAddress?: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  image: string;
  color: string;
  configuration: string;
  price: number;
  quantity: number;
  deliveryDays?: number;
}

export interface ConfirmedOrder {
  orderId: string;
  total: number;
  subtotal: number;
  discount: number;
  items: CartItem[];
  address: AddressFormData;
  placedAt: string;
  estimatedDelivery: string;
  paymentRef: string;
}

export type CheckoutStep = "delivery";

interface CheckoutStore {
  // Step state
  step: CheckoutStep;
  setStep: (step: CheckoutStep) => void;

  // Delivery state
  deliveryAddress: AddressFormData | null;
  setDeliveryAddress: (address: AddressFormData) => void;

  // Discount
  discountCode: string | null;
  discountAmount: number;
  applyDiscount: (code: string) => boolean;
  clearDiscount: () => void;

  // Cart items
  cartItems: CartItem[];
  setCartItems: (items: CartItem[]) => void;

  // Confirmed order
  confirmedOrder: ConfirmedOrder | null;
  setConfirmedOrder: (order: ConfirmedOrder) => void;

  // Reset
  reset: () => void;
}

const initialState = {
  step: "delivery" as const,
  deliveryAddress: null,
  discountCode: null,
  discountAmount: 0,
  cartItems: [],
  confirmedOrder: null,
};

export const useCheckoutStore = create<CheckoutStore>((set, get) => ({
  ...initialState,

  setStep: (step) => set({ step }),

  setDeliveryAddress: (address) => set({ deliveryAddress: address }),

  applyDiscount: (code) => {
    const discounts: Record<string, number> = {
      EVOL10: 5584,
      EVOL20: 11168,
      WELCOME: 2500,
    };

    const amount = discounts[code.toUpperCase()];
    if (amount) {
      set({ discountCode: code.toUpperCase(), discountAmount: amount });
      return true;
    }
    return false;
  },

  clearDiscount: () => set({ discountCode: null, discountAmount: 0 }),

  setCartItems: (items) => set({ cartItems: items }),

  setConfirmedOrder: (order) => set({ confirmedOrder: order }),

  reset: () => set(initialState),
}));
