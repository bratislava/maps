import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  publicDir: "public",
  envPrefix: "PUBLIC_",
  base: "/wp-content/uploads/fast-interventions-map/",
});