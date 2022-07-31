import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import checker from "vite-plugin-checker";

export default defineConfig({
  plugins: [react(), svgr(), checker({ typescript: true })],
  publicDir: "public",
  envPrefix: "PUBLIC_",
  base: "/static-pages/paas-map/",
});
