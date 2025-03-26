import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/db";
import { productsTable } from "@/db/schema";
import { inArray } from "drizzle-orm";
import { Product } from "../products/route";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  try {
    const { items, confirmationTokenId } = (await request.json()) as {
      items: Product[];
      confirmationTokenId: string;
    };

    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ error: "Invalid items" }, { status: 400 });
    }

    const productIds = items.map((item) => item.id);
    const products = await db
      .select()
      .from(productsTable)
      .where(inArray(productsTable.id, productIds));

    const totalAmount = products.reduce(
      (total, product) => total + product.price,
      0
    );

    const intent = await stripe.paymentIntents.create({
      confirm: true,
      amount: totalAmount * 100,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      confirmation_token: confirmationTokenId,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/complete`,
    });

    return NextResponse.json(
      {
        client_secret: intent.client_secret,
        status: intent.status,
      },
      { status: 200 }
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown error creating payment intent";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
