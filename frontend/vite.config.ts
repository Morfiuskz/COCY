import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: true,                // слушать на 0.0.0.0
    port: 5173,
    allowedHosts: [
      "684777b8d019.ngrok-free.app",       // разрешить все поддомены ngrok
    ],
  },
});
