"use client";

import { useEffect, useState } from "react";
import Checkout from "../_components/checkout";
import Header from "../_components/header";
import { useShoppingCartProducts } from "@/globalState/shoppingCartStore";
import { Product } from "../api/products/route";

export default function CheckoutPage() {
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

  const uniqueProducts = Object.keys(productQuantities)
    .map((id) => shoppingCartProducts.find((p) => p.id.toString() === id))
    .filter((product): product is Product => product !== undefined);

  return (
    <div className="bg-white">
      <Header renderShoppingCart={false} />
      <div className="flex flex-col items-center justify-center mx-auto max-w-2xl px-4 py-5 sm:px-6 sm:py-10 lg:max-w-7xl lg:px-8">
        <div className="my-10 w-full">
          <div className="mt-4 rounded-lg border border-gray-200 bg-white shadow-sm">
            <ul role="list" className="divide-y divide-gray-200">
              {uniqueProducts.map((product) => (
                <li key={product.id} className="flex px-4 py-6 sm:px-6">
                  <div className="">
                    <img
                      alt={product.title}
                      src={product.imageUrl}
                      className="w-20 rounded-md"
                    />
                  </div>

                  <div className="ml-6 flex flex-1 flex-col">
                    <div className="flex">
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm">{product.title}</h4>
                      </div>
                    </div>

                    <div className="flex flex-1 items-end justify-between pt-2">
                      <p className="mt-1 text-sm font-medium text-gray-900">
                        ${product.price}
                      </p>
                      <div className="ml-4">
                        <label htmlFor="quantity" className="text-sm">
                          Qty {productQuantities[product.id.toString()]}
                        </label>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <dl className="space-y-6 px-4 py-6 sm:px-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <dt className="text-base font-medium">Total</dt>
                <dd className="text-base font-medium text-gray-900">
                  ${subtotal}
                </dd>
              </div>
            </dl>
          </div>
        </div>
        <Checkout />
      </div>
    </div>
  );
}
