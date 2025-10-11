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
  // esbuild 配置（用于开发和生产环境）
  esbuild: {
    // 生产环境移除 console 和 debugger
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
  },
  build: {
    // 设置代码分割的大小阈值（单位：KB），提高阈值以适应大型 UI 库
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        // 手动分包配置 - 优化后的分包策略
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
      // 优化 Rollup 性能，减少内存占用
      maxParallelFileOps: 2, // 限制并行文件操作（适合低配服务器）
    },
    // 使用 esbuild 压缩，比 terser 快很多，资源消耗更少
    minify: 'esbuild',
    // 优化构建性能
    target: 'esnext',
    // 减少不必要的构建输出
    reportCompressedSize: false,
    // 关闭 CSS 代码分割，减少请求数（适合小带宽）
    cssCodeSplit: false,
    // 设置较大的 chunk 大小限制，减少文件数量
    // ⚠️ 注意：chunkSizeWarningLimit 已在上方设置，不能重复设置，否则会导致对象属性重复报错
    // 如需调整，请修改上方的 chunkSizeWarningLimit 配置即可
    // chunkSizeWarningLimit: 2000,
  },
})
