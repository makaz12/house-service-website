import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages serves this app from /house-service-website/.
export default defineConfig({
  base: "/house-service-website/",
  plugins: [react()],
});
