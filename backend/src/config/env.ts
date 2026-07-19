import { z } from "zod";
import * as dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  PORT: z.string().optional().default("8000"),
  DATABASE_URL: z.string().url({ message: "DATABASE_URL must be a valid URL" }),
  JWT_SECRET: z.string().min(8, { message: "JWT_SECRET is too short" }).default("your-secret-key-that-is-at-least-32-chars!"), // Fallback for dev
  FRONTEND_URL: z.string().url().optional().default("http://localhost:3000"),
  RESEND_API_KEY: z.string().optional(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Invalid environment variables:");
  console.error(_env.error.format());
  process.exit(1);
}

export const env = _env.data;
