// next.config.mjs - build and server settings for Next.js. It runs on the server only (never in the browser).

// Where the real API lives. Only needed for "proxy mode" (see lib/api.js). Read from .env.local.
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // REWRITES: Next.js answers a browser request for /api/... by quietly forwarding it to the backend.
  //   browser  ->  http://localhost:3000/api/employees     (same origin: no CORS, cookie belongs to :3000)
  //   Next.js  ->  http://localhost:5000/api/employees     (server-to-server: CORS does not exist here)
  // This rule is harmless in "direct" mode: nothing calls /api on port 3000, so it just sits unused.
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${BACKEND_URL}/api/:path*` }];
  },
};

export default nextConfig;
