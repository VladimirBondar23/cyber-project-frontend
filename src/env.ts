import { z } from "zod";

const schema = z.object({
  NEXT_PUBLIC_SERVER_URL: z.string().url(),       // e.g., http://localhost:3000
  NODE_ENV: z.enum(["development","production","test"]).default("development"),
});

const parsed = schema.safeParse({
  NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
  NODE_ENV: process.env.NODE_ENV,
});

if (!parsed.success) {
  // Fail fast (as required by the task)
  // In Next, this will surface at build or dev startup
  // eslint-disable-next-line no-console
  console.error("Environment validation error:", parsed.error.flatten());
  throw new Error("Invalid environment");
}

export const env = parsed.data;
