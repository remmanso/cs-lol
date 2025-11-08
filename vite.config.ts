import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ["babel-plugin-macros", "babel-plugin-styled-components"],
      },
    }),
  ],
  server: {
    port: 3000,
    allowedHosts: ["lol.loki-corp.com"],
  },
  preview: {
    port: 3000,
    allowedHosts: ["lol.loki-corp.com"],
  },
});
