import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons-ng";
import path from "path";

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ["babel-plugin-macros", "babel-plugin-styled-components"],
      },
    }),
    createSvgIconsPlugin({
      // Specify the icon folder to be cached
      iconDirs: [path.resolve(process.cwd(), "src/icons")],
      // Specify symbolId format
      symbolId: "icon-[dir]-[name]",
      customDomId: "__svg__icons__dom__",
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
