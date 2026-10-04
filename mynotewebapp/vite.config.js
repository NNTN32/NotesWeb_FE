import { env } from "node:process";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: env.API_PROXY_TARGET || "http://localhost:8081",
        changeOrigin: true,
      },
    },
  },
});
