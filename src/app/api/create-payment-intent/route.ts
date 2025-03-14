import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/db";
import { productsTable } from "@/db/schema";
import { inArray } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  try {
    const { items } = await request.json();

    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ error: "Invalid items" }, { status: 400 });
    }

    const productIds = items.map((item: { id: number }) => item.id);
    const products = await db
      .select()
      .from(productsTable)
      .where(inArray(productsTable.id, productIds));

    const totalAmount = products.reduce(
      (total, product) => total + product.price,
      0
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount * 100,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      // [DEV]: For demo purposes only, you should avoid exposing the PaymentIntent ID in the client-side code.
      dpmCheckerLink: `https://dashboard.stripe.com/settings/payment_methods/review?transaction_id=${paymentIntent.id}`,
    });
  } catch (error) {
    console.error("error creating payment intent:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Unknown error creating payment intent";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
