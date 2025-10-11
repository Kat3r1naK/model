# 学习追踪模型对比系统

一个用于比较不同学习追踪模型（如 BKT、PFA、IRT）在各种数据集上表现的可视化系统。

## 技术栈

- **Vue 3** - 渐进式 JavaScript 框架
- **TypeScript** - 类型安全
- **Pinia** - 状态管理
- **Element Plus** - UI 组件库
- **ECharts** - 数据可视化
- **Tailwind CSS** - 实用优先的 CSS 框架
- **Vite** - 构建工具
- **ESLint + Prettier** - 代码规范
- **Husky** - Git hooks

## 功能特性

- ✅ 多模型选择（BKT、PFA、IRT）
- ✅ 多数据集选择（代数、几何、编程）
- ✅ 同时对比多个模型
- ✅ 实时可视化结果（Accuracy 曲线）
- ✅ 清空结果功能
- ✅ 响应式设计

## 开始使用

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm dev
```

### 构建生产版本

```bash
pnpm build
```

### 代码检查

```bash
pnpm lint
```

### 代码格式化

```bash
pnpm format
```

## 项目结构

```
src/
├── assets/          # 静态资源
├── components/      # 组件
├── stores/          # Pinia 状态管理
├── types/           # TypeScript 类型定义
├── utils/           # 工具函数
├── App.vue          # 根组件
└── main.ts          # 入口文件
```

## License

MIT

