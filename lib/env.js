import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    // Database
    DATABASE_URL: z // MongoDB URL
      .string()
      .regex(
        /^mongodb(?:\+srv)?:\/\//,
        "Invalid MongoDB URI: Must start with mongodb:// or mongodb+srv://",
      ),

    // NextAuth Configuration
    NEXTAUTH_SECRET: z.string().min(1),
    NEXTAUTH_URL: z.string().min(1),

    // News Service (from gnews.io)
    NEWS_URL: z.string().min(1),

    // Authentication Providers
    GOOGLE_CLIENT_ID: z.string().min(1), // Google (from Google Cloud Console)
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    DISCORD_CLIENT_ID: z.string().min(1), // Discord (from Discord Developer Portal)
    DISCORD_CLIENT_SECRET: z.string().min(1),

    // Third-Party Services API Keys
    RESEND_API_KEY: z.string().min(1), // Resend - Email Provider API Key (https://resend.com/api-keys)

    // Sanity Configuration
    SANITY_STUDIO_PROJECT_ID: z.string().min(1), // From (https://sanity.io)
    SANITY_STUDIO_DATASET: z.string().min(1),
  },
  client: {
    // Public Configuration
    NEXT_PUBLIC_BASE_URL: z.string().min(1),
  },
  runtimeEnv: {
    // Server Environment Variables
    DATABASE_URL: process.env.DATABASE_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEWS_URL: process.env.NEWS_URL,

    // Authentication Providers Environment Variables
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
    DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,

    // Third-Party Services Environment Variables
    RESEND_API_KEY: process.env.RESEND_API_KEY,

    // Sanity Environment Variables
    SANITY_STUDIO_PROJECT_ID: process.env.SANITY_STUDIO_PROJECT_ID,
    SANITY_STUDIO_DATASET: process.env.SANITY_STUDIO_DATASET,

    // Client Environment Variables
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  },
});
