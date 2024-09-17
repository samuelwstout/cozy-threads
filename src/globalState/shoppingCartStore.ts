import { create } from "zustand";

interface ShoppingCartState {
  openShoppingCart: boolean;
  setOpenShoppingCart: () => void;
}

export const useOpenShoppingCart = create<ShoppingCartState>((set) => ({
  openShoppingCart: false,
  setOpenShoppingCart: () =>
    set((state) => ({ openShoppingCart: !state.openShoppingCart })),
}));
