import { defineConfig } from "vite"; // defineConfig gives editor auto-complete for the options below
import react from "@vitejs/plugin-react"; // plugin that lets Vite understand JSX and React Fast Refresh

export default defineConfig({ // export the configuration object Vite reads at start-up
  plugins: [react()], // turn on React support
  server: { // settings for the development server (npm run dev)
    port: 3000, // the Day 4 backend allows CORS only from http://localhost:3000 (CLIENT_URL), so we use that port
    strictPort: true, // fail loudly if 3000 is busy instead of silently picking another port (which CORS would block)
  },
});
