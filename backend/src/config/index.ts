import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

// Load environment variables - resolve path relative to this file's location
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Go up from config/ to backend/ root
const envPath = resolve(__dirname, "..", "..", ".env");
dotenv.config({ path: envPath });

/**
 * Configuration interface for type safety
 */
export interface Config {
  port: number;
  nodeEnv: "development" | "production" | "test";
  jwt: {
    secret: string;
    expiresIn: string;
  };
  supabase: {
    url: string;
    serviceRoleKey: string;
  };
  ipinfo: {
    baseUrl: string;
    token: string;
  };
  cors: {
    origin: string | string[];
  };
}

/**
 * Validates that required environment variables are present
 */
function validateEnv(): void {
  const required = [
    "SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
    "JWT_SECRET",
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    const errorMessage = `
Missing required environment variables: ${missing.join(", ")}

Please create a .env file in the backend/ directory with the following variables:
${required.map((key) => `${key}=your_${key.toLowerCase()}_here`).join("\n")}

See .env.example for a template.
    `.trim();
    throw new Error(errorMessage);
  }
}

/**
 * Get configuration with validation
 */
export function getConfig(): Config {
  validateEnv();

  return {
    port: parseInt(process.env.PORT || "8000", 10),
    nodeEnv: (process.env.NODE_ENV || "development") as Config["nodeEnv"],
    jwt: {
      secret: process.env.JWT_SECRET!,
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    },
    supabase: {
      url: process.env.SUPABASE_URL!,
      serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    },
    ipinfo: {
      baseUrl: process.env.IPINFO_BASE_URL || "https://ipinfo.io",
      token: process.env.IPINFO_TOKEN || "",
    },
    cors: {
      origin: process.env.CORS_ORIGIN || "*",
    },
  };
}

export const config = getConfig();
