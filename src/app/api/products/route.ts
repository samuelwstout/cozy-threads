import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { db } from "@/db";
import { productsTable } from "@/db/schema";

export async function GET() {
  return NextResponse.json({ message: "GET request to products route" });
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

    // Upload image to Vercel Blob
    const blob = await put(image.name, image, { access: "public" });

    // Insert product into database
    const [product] = await db
      .insert(productsTable)
      .values({
        title,
        description,
        price,
        imageUrl: blob.url,
      })
      .returning();

    return NextResponse.json({
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    return NextResponse.json(
      { error: "Failed to add product" },
      { status: 500 }
    );
  }
}
