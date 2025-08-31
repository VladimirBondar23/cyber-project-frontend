import { z } from "zod";

const schema = z.object({
  NEXT_PUBLIC_SERVER_URL: z.string().url(),      
  NODE_ENV: z.enum(["development","production","test"]).default("development"),
});

const parsed = schema.safeParse({
  NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
  NODE_ENV: process.env.NODE_ENV,
});

if (!parsed.success) {
  console.error("Environment validation error:", parsed.error.flatten());
  throw new Error("Invalid environment");
}

export const env = parsed.data;
