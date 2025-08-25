import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import strip from '@rollup/plugin-strip'
import path from 'path'

export default defineConfig(({ mode }) => ({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    rollupOptions: {
      plugins: [
        ...(mode === 'production'
          ? [
              strip({
                include: ['**/*.js', '**/*.ts', '**/*.vue'],
                functions: ['console.*', 'assert.*'],
                debugger: true,
              }),
            ]
          : []),
      ],
    },
  },
}))
