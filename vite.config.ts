import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// base './' — 대시보드 GitHub Pages 서브패스(/project-dashboard/claude/previews/semiconductor-universe/)
// 및 iframe 임베드 양쪽에서 동작하도록 상대경로 빌드. (korea-gov-sim 등 다른 프리뷰와 동일 패턴)
export default defineConfig({
  base: './',
  plugins: [react()],
})
