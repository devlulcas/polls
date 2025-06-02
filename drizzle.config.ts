import * as env from "dotenv";
import { defineConfig } from "drizzle-kit";

env.configDotenv({
  path: ".env.local",
});

export default defineConfig({
  out: "./drizzle",
  schema: "src/modules/database/lib/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
