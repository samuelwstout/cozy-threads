"use client";

import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import "../checkout.css";
import { useState } from "react";
import { useShoppingCartProducts } from "@/globalState/shoppingCartStore";
import { useRouter } from "next/navigation";
import { StripeError, PaymentIntent } from "@stripe/stripe-js";

interface PaymentIntentResponse {
  client_secret: string | undefined;
  status: PaymentIntent.Status | undefined;
  error?: string;
}

export default function CheckoutForm() {
  const shoppingCartProducts = useShoppingCartProducts(
    (state) => state.shoppingCartProducts
  );

  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleError = (error: StripeError) => {
    setLoading(false);
    setErrorMessage(error.message || "An unknown error occurred");
  };

  const handleServerResponse = async (response: PaymentIntentResponse) => {
    if (response.error) {
      // Show error from server on payment form
      handleError({ message: response.error } as StripeError);
      setLoading(false);
    } else if (
      response.status === "requires_action" &&
      response.client_secret
    ) {
      const result = await stripe?.handleNextAction({
        clientSecret: response.client_secret,
      });

      if (result?.error) {
        handleError(result.error);
        setLoading(false);
      } else {
        router.push(
          `/complete?payment_intent_client_secret=${encodeURIComponent(
            response.client_secret
          )}`
        );
      }
    } else if (response.client_secret) {
      console.log("No actions needed! Success!");

      router.push(
        `/complete?payment_intent_client_secret=${encodeURIComponent(
          response.client_secret
        )}`
      );
    } else {
      handleError({
        message: "Invalid response from payment server",
      } as StripeError);
      setLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe) {
      return;
    }

    setLoading(true);

    const result = await elements?.submit();
    const submitError = result?.error;

    if (submitError) {
      handleError(submitError);
      return;
    }

    if (elements) {
      const { error, confirmationToken } = await stripe.createConfirmationToken(
        {
          elements,
        }
      );

      if (error) {
        handleError(error);
        return;
      }

      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: shoppingCartProducts,
          confirmationTokenId: confirmationToken.id,
        }),
      });

      const data = await res.json();

      console.log("data: ", data);
      handleServerResponse(data);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <PaymentElement />
        <button
          id="submit"
          type="submit"
          disabled={!stripe || loading}
          className="mt-2"
        >
          {loading ? (
            <span>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 inline-block"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </span>
          ) : (
            "Submit"
          )}
        </button>
        {errorMessage && (
          <div className="text-red-500 mt-2">{errorMessage}</div>
        )}
      </form>
    </>
  );
}
