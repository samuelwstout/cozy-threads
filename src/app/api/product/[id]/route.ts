import { NextResponse } from "next/server";
import { db } from "@/db";
import { productsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10);

  if (isNaN(id) || id <= 0) {
    return NextResponse.json({ error: "Invalid product id" }, { status: 400 });
  }

  try {
    const [product] = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, id))
      .limit(1);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);

    const message =
      error instanceof Error ? error.message : "Unknown error fetching product";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
