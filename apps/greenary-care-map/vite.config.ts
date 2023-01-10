import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import checker from "vite-plugin-checker";
import { resolve } from "path";
import postcss from "./postcss.config.js";

export default defineConfig({
  plugins: [react(), svgr(), checker({ typescript: true })],
  publicDir: "./public",
  envPrefix: "PUBLIC_",
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        en: resolve(__dirname, "en.html"),
        sk: resolve(__dirname, "sk.html"),
      },
      output: {
        manualChunks: {
          "mapbox-gl": ["mapbox-gl"],
          "framer-motion": ["framer-motion"],
          "@bratislava/geojson-data": ["@bratislava/geojson-data"],
          "@bratislava/react-maps": ["@bratislava/react-maps"],
        },
      },
    },
  },
  base: "./",
    css: {
    postcss
  }
});
