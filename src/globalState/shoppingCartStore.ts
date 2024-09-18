import { Product } from "@/app/api/products/route";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface ShoppingCartState {
  openShoppingCart: boolean;
  setOpenShoppingCart: () => void;
}

export interface ShoppingCartProductState {
  shoppingCartProducts: Product[];
  setShoppingCartProducts: (product: Product) => void;
  resetShoppingCart: () => void;
}

export const useOpenShoppingCart = create<ShoppingCartState>((set) => ({
  openShoppingCart: false,
  setOpenShoppingCart: () =>
    set((state) => ({ openShoppingCart: !state.openShoppingCart })),
}));

export const useShoppingCartProducts = create<ShoppingCartProductState>()(
  persist(
    (set) => ({
      shoppingCartProducts: [],
      setShoppingCartProducts: (product: Product) =>
        set((state) => ({
          shoppingCartProducts: [...state.shoppingCartProducts, product],
        })),
      resetShoppingCart: () => set({ shoppingCartProducts: [] }),
    }),
    {
      name: "shopping-cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
