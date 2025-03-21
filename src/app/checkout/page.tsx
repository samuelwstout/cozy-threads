"use client";

import { useEffect, useState } from "react";
import Header from "../_components/Header";
import { useShoppingCartProducts } from "@/globalState/shoppingCartStore";
import { Product } from "../api/products/route";
import {
  AddressElement,
  Elements,
  LinkAuthenticationElement,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "../_components/Checkout";
import { BeatLoader } from "react-spinners";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const appearance = {
  /* ... */
};

const loader = "auto";

export default function CheckoutPage() {
  const shoppingCartProducts = useShoppingCartProducts(
    (state) => state.shoppingCartProducts
  );

  const [subtotal, setSubtotal] = useState<number>(0);
  const [productQuantities, setProductQuantities] = useState<
    Record<string, number>
  >({});
  const [openPaymentElement, setOpenPaymentElement] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dpmCheckerLink, setDpmCheckerLink] = useState("");

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    if (shoppingCartProducts.length !== 0) {
      fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: shoppingCartProducts }),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to create payment intent");
          }
          return res.json();
        })
        .then((data) => {
          setClientSecret(data.clientSecret);
          setDpmCheckerLink(data.dpmCheckerLink);
        })
        .catch((err) => {
          setError(err.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [shoppingCartProducts]);

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
      <div className="border border-red-500 flex flex-row items-center justify-center mx-auto max-w-2xl px-4 py-5 sm:px-6 sm:py-10 lg:max-w-7xl lg:px-8 gap-5">
        {clientSecret ? (
          <Elements stripe={stripePromise} options={{ clientSecret, loader }}>
            <div className="border border-green-500 flex flex-col gap-2 p-5 w-full">
              <div className="p-5">
                <LinkAuthenticationElement />
              </div>
              <div className="p-5">
                <h3 className="pb-2">Shipping</h3>
                <AddressElement
                  options={{ mode: "shipping" }}
                  onChange={(event) => {
                    if (event.complete) {
                      const address = event.value.address;
                    }
                  }}
                />
              </div>
              <div className="p-5">
                <CheckoutForm dpmCheckerLink={dpmCheckerLink} />
              </div>
            </div>
          </Elements>
        ) : (
          <div className="w-full flex justify-center">
            <BeatLoader size={10} />
          </div>
        )}
        <div className="my-10 w-full border border-blue-500">
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
      </div>
    </div>
  );
}
