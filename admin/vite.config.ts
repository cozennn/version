import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const apiOrigin = "https://norda-api.houda2004houdaa.workers.dev";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    strictPort: true,
    proxy: {
      "/api": {
        target: apiOrigin,
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, "")
      }
    }
  }
});