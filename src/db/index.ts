import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

console.log("TURSO_CONNECTION_URL:", process.env.TURSO_CONNECTION_URL);
console.log("TURSO_AUTH_TOKEN:", process.env.TURSO_AUTH_TOKEN);

const client = createClient({
  url: process.env.TURSO_CONNECTION_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export const db = drizzle(client);
