import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [remix()],
  resolve: {
    alias: {
      "~": "/app",
    },
  },
  build: {
    target: ['chrome58', 'firefox57', 'safari11', 'edge79'],
  }
});
