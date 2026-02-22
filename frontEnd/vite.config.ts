import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  // Load .env, .env.local, .env.[mode], etc.
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    server: {
      host: "127.0.0.1",
      port: Number(env.VITE_PORT) || 3000,
      open: true,
    },
  };
});