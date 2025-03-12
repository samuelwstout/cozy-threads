import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    const refund = await stripe.refunds.create({
      payment_intent: id,
    });

    return NextResponse.json({
      refund: refund,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to process refund" },
      { status: 500 }
    );
  }
}
