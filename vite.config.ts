import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
    port: 5173,
    allowedHosts: [
      'localhost',
      '639c-2401-4900-361f-1a99-c556-be6e-db9c-4739.ngrok-free.app'
    ]
  }
});
