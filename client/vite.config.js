import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Keep the old REACT_APP_* names working while supporting Vite's VITE_* convention.
  envPrefix: ["VITE_", "REACT_APP_"],
  plugins: [react()],
  build: {
    // Render Static Site can publish this folder without depending on the server service.
    outDir: "build",
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.js",
  },
});
