import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import checker from "vite-plugin-checker";
import postcss from "./postcss.config.js";

export default defineConfig({
  plugins: [react(), svgr(), checker({ typescript: true })],
  publicDir: "public",
  envPrefix: "PUBLIC_",
  base: "./",
  build: {
    chunkSizeWarningLimit: 1000,
  },
  css: {
    postcss
  }
});
