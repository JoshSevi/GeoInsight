// Vercel serverless function entry point for the GeoInsight backend
// This adapts the shared Express app (compiled to dist/app.js) to Vercel's
// Node.js serverless function runtime without calling app.listen().

const { createApp } = require("../dist/app.js");

// Create a single Express app instance that will be reused across invocations
const app = createApp();

/**
 * Vercel Node.js Serverless Function handler.
 *
 * @param {import('@vercel/node').VercelRequest} req
 * @param {import('@vercel/node').VercelResponse} res
 */
module.exports = (req, res) => {
  return app(req, res);
};


