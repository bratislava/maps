import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [react(), svgr(), checker({ typescript: true })],
  publicDir: "public",
  envPrefix: "PUBLIC_",
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
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
});
