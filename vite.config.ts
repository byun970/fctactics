import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // VITE_ 접두사가 없는 키는 클라이언트 번들에 포함되지 않음
  const { NEXON_API_KEY } = loadEnv(mode, process.cwd(), "");

  return {
    base: "/", // 중첩 경로(/search/:nickname) 새로고침 시에도 에셋 경로가 깨지지 않도록 절대 경로 사용
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },

    server: {
      watch: {
        ignored: ["**/server/**"],
      },
      proxy: {
        // 개발 환경: 프록시에서 API 키 주입 (배포 환경은 api/nexon.ts)
        "/api/fconline/v1": {
          target: "https://open.api.nexon.com",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
          headers: { "x-nxopen-api-key": NEXON_API_KEY },
        },
      },
    },
  };
});
