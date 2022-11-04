/* eslint-disable camelcase */
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";
import svgr from "vite-plugin-svgr";
import { VitePWA } from "vite-plugin-pwa";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    react(),
    svgr(),
    checker({ typescript: true }),
    VitePWA({
      devOptions: {
        enabled: true,
      },
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
      manifest: {
        name: "PAAS - Zone map",
        short_name: "PAAS - Zone map",
        theme_color: "#71ca55",
        start_url: "/static-pages/paas-map/index.html?lang=sk",
        background_color: "#ffffff",
        display: "fullscreen",
        icons: [
          {
            src: "android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
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
});
