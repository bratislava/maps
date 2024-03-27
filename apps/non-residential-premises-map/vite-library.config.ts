// vite-library.config.js
import { resolve } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import checker from "vite-plugin-checker";
import dts from "vite-plugin-dts";
import postcss from "./postcss.config";

export default defineConfig({
  plugins: [react(), svgr(), checker({ typescript: true }), dts({ insertTypesEntry: true })],
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, "main.ts"),
      name: "MyLib",
      // the proper extensions will be added
      fileName: "my-lib",
      formats: ["es"],
    },
    // rollupOptions: {
    //   // make sure to externalize deps that shouldn't be bundled
    //   // into your library
    //   external: ["vue"],
    //   output: {
    //     // Provide global variables to use in the UMD build
    //     // for externalized deps
    //     globals: {
    //       vue: "Vue",
    //     },
    //   },
    // },
  },
  css: {
    postcss,
  },
});
