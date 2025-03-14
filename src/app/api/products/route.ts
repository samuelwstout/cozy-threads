import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { db } from "@/db";
import { productsTable } from "@/db/schema";
import Stripe from "stripe";

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  createdAt: string;
  updateAt: Date | null;
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET() {
  try {
    const products: Product[] = await db.select().from(productsTable);
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Unknown error fetching products";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = parseInt(formData.get("price") as string, 10);
    const image = formData.get("image") as File;

    if (!title || !description || !price || !image) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const blob = await put(image.name, image, { access: "public" });

    const stripeProduct = await stripe.products.create({
      name: title,
      description: description,
      images: [blob.url],
    });

    const stripePrice = await stripe.prices.create({
      product: stripeProduct.id,
      unit_amount: price * 100,
      currency: "usd",
    });

    const [product] = await db
      .insert(productsTable)
      .values({
        title,
        description,
        price,
        imageUrl: blob.url,
        stripeProductId: stripeProduct.id,
        stripePriceId: stripePrice.id,
      })
      .returning();

    return NextResponse.json({
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    console.error("Error adding product:", error);

    const message =
      error instanceof Error ? error.message : "Unknown error adding product";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
