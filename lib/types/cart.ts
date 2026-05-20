/**
 * Cart and checkout related type definitions
 */

export interface CartItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  metal?: string;
  carat?: number;
  size?: number | string;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}
