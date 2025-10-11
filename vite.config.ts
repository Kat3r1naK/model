import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    // 设置代码分割的大小阈值（单位：KB），提高阈值以适应大型 UI 库
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        // 手动分包配置
        manualChunks: {
          // Vue 核心库
          'vue-vendor': ['vue', 'pinia'],
          // ECharts 单独分包（通常比较大）
          echarts: ['echarts'],
          // Element Plus UI 库单独分包
          'element-plus': ['element-plus', '@element-plus/icons-vue'],
        },
        // 配置输出文件名
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    // 启用源码压缩
    minify: 'terser',
    terserOptions: {
      compress: {
        // 生产环境移除 console
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
})
