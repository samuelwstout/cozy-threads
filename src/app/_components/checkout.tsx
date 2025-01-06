"use client";

import React, { useState, useEffect } from "react";
import { loadStripe, StripePaymentElementOptions } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useShoppingCartProducts } from "@/globalState/shoppingCartStore";
import "../checkout.css";
import { BeatLoader } from "react-spinners";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

function CheckoutForm({ dpmCheckerLink }: { dpmCheckerLink: string }) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/complete`,
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message ?? "An error occurred");
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  const paymentElementOptions: StripePaymentElementOptions = {
    layout: "tabs",
  };

  return (
    <>
      <form id="payment-form" onSubmit={handleSubmit}>
        <PaymentElement id="payment-element" options={paymentElementOptions} />
        <button disabled={isLoading || !stripe || !elements} id="submit">
          <span id="button-text">
            {isLoading ? (
              <div className="spinner" id="spinner"></div>
            ) : (
              "Pay now"
            )}
          </span>
        </button>
        {message && <div id="payment-message">{message}</div>}
      </form>
      <div id="dpm-annotation">
        <p>
          Payment methods are dynamically displayed based on customer location,
          order amount, and currency.&nbsp;
          <a
            href={dpmCheckerLink}
            target="_blank"
            rel="noopener noreferrer"
            id="dpm-integration-checker"
          >
            Preview payment methods by transaction
          </a>
        </p>
      </div>
    </>
  );
}

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const shoppingCartProducts = useShoppingCartProducts(
    (state) => state.shoppingCartProducts
  );
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

  return (
    <div>
      {isLoading ? (
        <BeatLoader size={10} />
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : clientSecret ? (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm dpmCheckerLink={dpmCheckerLink} />
        </Elements>
      ) : (
        <div className="error-message">Unable to initialize payment</div>
      )}
    </div>
  );
}
