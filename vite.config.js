import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import strip from '@rollup/plugin-strip'
import path from 'path'

export default defineConfig(({ mode }) => ({
  plugins: [vue()],
  server: {
    // port: 8081, // 前端启动端口
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // 后端服务地址
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, ''), // 等价于 pathRewrite
      },
    },
  },
  build: {
    rollupOptions: {
      plugins:
        mode === 'production'
          ? [
              strip({
                include: ['**/*.js', '**/*.ts', '**/*.vue'],
                functions: ['console.*', 'assert.*'],
                debugger: true,
              }),
            ]
          : [],
    },
  },
}))
