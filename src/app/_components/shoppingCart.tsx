"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  useOpenShoppingCart,
  useShoppingCartProducts,
} from "@/globalState/shoppingCartStore";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Product } from "../api/products/route";

export default function ShoppingCart() {
  const openShoppingCart = useOpenShoppingCart(
    (state) => state.openShoppingCart
  );
  const setOpenShoppingCart = useOpenShoppingCart(
    (state) => state.setOpenShoppingCart
  );
  const shoppingCartProducts = useShoppingCartProducts(
    (state) => state.shoppingCartProducts
  );

  const [subtotal, setSubtotal] = useState<number>(0);
  const [productQuantities, setProductQuantities] = useState<
    Record<string, number>
  >({});

  useEffect(() => {
    const quantities: Record<string, number> = {};
    const subtotal = shoppingCartProducts.reduce((total, product) => {
      quantities[product.id.toString()] =
        (quantities[product.id.toString()] || 0) + 1;
      return total + product.price;
    }, 0);

    setSubtotal(subtotal);
    setProductQuantities(quantities);
  }, [shoppingCartProducts]);

  const removeOneProduct = (productId: number | string) => {
    const updatedProducts = shoppingCartProducts.filter(
      (product, index) =>
        !(
          product.id.toString() === productId.toString() &&
          shoppingCartProducts.findIndex(
            (p) => p.id.toString() === productId.toString()
          ) === index
        )
    );

    // Reset the cart with the updated products
    useShoppingCartProducts.setState({ shoppingCartProducts: updatedProducts });
  };

  const uniqueProducts = Object.keys(productQuantities)
    .map((id) => shoppingCartProducts.find((p) => p.id.toString() === id))
    .filter((product): product is Product => product !== undefined);

  return (
    <Dialog
      open={openShoppingCart}
      onClose={setOpenShoppingCart}
      className="relative z-10"
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-500 ease-in-out data-[closed]:opacity-0"
      />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <DialogPanel
              transition
              className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
            >
              <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                  <div className="flex items-start justify-between">
                    <DialogTitle className="text-lg font-medium text-gray-900">
                      Shopping cart
                    </DialogTitle>
                    <div className="ml-3 flex h-7 items-center">
                      <button
                        type="button"
                        onClick={setOpenShoppingCart}
                        className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                      >
                        <span className="absolute -inset-0.5" />
                        <span className="sr-only">Close panel</span>
                        <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-8">
                    <div className="flow-root">
                      <ul
                        role="list"
                        className="-my-6 divide-y divide-gray-200"
                      >
                        {uniqueProducts.map((product) => (
                          <li key={product.id} className="flex py-6">
                            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                              <img
                                alt={product.title}
                                src={product.imageUrl}
                                className="h-full w-full object-cover object-center"
                              />
                            </div>

                            <div className="ml-4 flex flex-1 flex-col">
                              <div>
                                <div className="flex justify-between text-base font-medium text-gray-900">
                                  <h3>{product.title}</h3>
                                  <p className="ml-4">${product.price}</p>
                                </div>
                              </div>
                              <div className="flex flex-1 items-end justify-between text-sm">
                                <p className="text-gray-500">
                                  Qty {productQuantities[product.id.toString()]}
                                </p>

                                <div className="flex">
                                  <button
                                    type="button"
                                    onClick={() => removeOneProduct(product.id)}
                                    className="font-medium text-indigo-600 hover:text-indigo-500"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <p>Subtotal</p>
                    <p>${subtotal.toFixed(2)}</p>
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500">
                    Shipping and taxes calculated at checkout.
                  </p>
                  <div className="mt-6">
                    <Link
                      onClick={setOpenShoppingCart}
                      href="/checkout"
                      className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                    >
                      Checkout
                    </Link>
                  </div>
                  <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                    <p>
                      or{" "}
                      <button
                        type="button"
                        onClick={setOpenShoppingCart}
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Continue Shopping
                        <span aria-hidden="true"> &rarr;</span>
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
