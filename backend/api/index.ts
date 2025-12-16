// Vercel serverless function entry point for the GeoInsight backend (Node runtime).
// Uses the shared Express app defined in src/app.ts without calling app.listen().

import { createApp } from "../src/app";

// Create a single Express app instance that will be reused across invocations.
const app = createApp();

export default function handler(req: any, res: any) {
  return app(req, res);
}



