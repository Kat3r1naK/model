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

# 快速开始指南 🚀

## 第一步：安装依赖

确保你已经安装了 **Node.js v18+** 和 **pnpm**。

### 安装 pnpm（如果还没有）

```bash
npm install -g pnpm
```

### 安装项目依赖

```bash
cd /Users/katerina/Desktop/learndir/model
pnpm install
```

安装过程可能需要几分钟，请耐心等待。

## 第二步：初始化 Git Hooks

```bash
pnpm prepare
```

这会设置 Husky，在每次 git commit 前自动运行代码检查和格式化。

## 第三步：启动开发服务器

```bash
pnpm dev
```

浏览器会自动打开 `http://localhost:3000`

## 第四步：开始使用

### 界面说明

系统界面分为以下几个部分：

1. **模型选择区（左侧）**
   - ✅ BKT - 贝叶斯知识追踪
   - ✅ PFA - 表现因素分析
   - ✅ IRT - 题目反应理论
   - 可以同时选择多个模型

2. **数据集选择区（右侧）**
   - ⭕ Algebra I - 代数一
   - ⭕ Geometry - 几何
   - ⭕ Programming 101 - 编程入门
   - 只能选择一个数据集

3. **操作按钮**
   - 🔵 运行对比 - 开始运行选中的模型
   - ⚪ 清空结果 - 清除图表

4. **结果展示区**
   - 📊 显示 Accuracy 随 Step 变化的曲线
   - 不同颜色代表不同模型
   - 鼠标悬停查看详细数据

### 使用步骤

1. **选择模型**
   - 勾选一个或多个你想要对比的模型
   - 例如：同时勾选 BKT、PFA 和 IRT

2. **选择数据集**
   - 点选一个数据集
   - 例如：选择 Programming 101

3. **运行对比**
   - 点击"运行对比"按钮
   - 等待 1 秒左右（模拟运行时间）
   - 查看生成的对比图表

4. **分析结果**
   - 观察不同模型的准确率曲线
   - 比较模型表现
   - 点击图例可以显示/隐藏特定模型的曲线

5. **清空结果**
   - 如需重新运行，点击"清空结果"
   - 或直接选择新的模型和数据集，再次运行

## 常见问题

### Q: 端口 3000 被占用怎么办？

A: 在 `vite.config.ts` 中修改端口：

```typescript
export default defineConfig({
  // ...
  server: {
    port: 3001, // 改成其他端口
    open: true,
  },
})
```

### Q: 依赖安装失败？

A: 尝试以下方法：

```bash
# 清除缓存
pnpm store prune

# 删除 node_modules
rm -rf node_modules

# 重新安装
pnpm install
```

### Q: 如何添加新的模型？

A: 在 `src/stores/modelStore.ts` 的 `availableModels` 中添加：

```typescript
{
  id: 'new-model',
  name: 'NEW',
  fullName: 'New Model Name',
  description: '新模型描述',
  color: '#ff6b6b', // 自定义颜色
}
```

然后在 `generateModelData` 的 switch 语句中添加对应的参数。

### Q: 如何添加新的数据集？

A: 在 `src/stores/modelStore.ts` 的 `availableDatasets` 中添加：

```typescript
{
  id: 'new-dataset',
  name: 'New Dataset',
  description: '新数据集',
}
```

### Q: 如何修改模拟数据生成逻辑？

A: 编辑 `src/stores/modelStore.ts` 中的 `generateModelData` 函数。

### Q: 如何连接真实的后端 API？

A:

1. 创建 `src/api/` 目录
2. 安装 axios: `pnpm add axios`
3. 创建 API 客户端
4. 在 `runComparison` 中调用真实 API

示例：

```typescript
// src/api/client.ts
import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
})

// src/api/models.ts
export const runModelComparison = async (models: string[], dataset: string) => {
  const response = await api.post('/run-comparison', { models, dataset })
  return response.data
}
```

## 开发技巧

### 1. 热重载

修改代码后，浏览器会自动刷新，无需手动刷新。

### 2. 代码检查

```bash
# 运行 ESLint 检查
pnpm lint

# 自动修复可修复的问题
pnpm lint --fix
```

### 3. 代码格式化

```bash
# 格式化所有代码
pnpm format
```

### 4. TypeScript 类型检查

```bash
# 检查类型错误（构建时会自动检查）
pnpm build
```

### 5. 预览生产版本

```bash
# 先构建
pnpm build

# 预览构建结果
pnpm preview
```

## 项目结构

```
src/
├── components/      # Vue 组件
├── stores/          # Pinia 状态管理
├── types/           # TypeScript 类型
├── styles/          # 样式文件
├── assets/          # 静态资源
├── App.vue          # 根组件
└── main.ts          # 入口文件
```

详细说明请查看 `PROJECT_STRUCTURE.md`

## 下一步

- 📖 阅读 `README.md` 了解项目详情
- 🔧 查看 `SETUP.md` 了解详细配置
- 📁 查看 `PROJECT_STRUCTURE.md` 了解项目结构
- 💡 开始添加你自己的功能！

## 团队协作

### Git 工作流

```bash
# 1. 克隆仓库（如果还没有）
git clone <your-repo-url>

# 2. 创建新分支
git checkout -b feature/your-feature-name

# 3. 开发和提交（会自动运行 lint-staged）
git add .
git commit -m "feat: add new feature"

# 4. 推送到远程
git push origin feature/your-feature-name

# 5. 创建 Pull Request
```

### 提交信息规范

使用约定式提交（Conventional Commits）：

- `feat:` 新功能
- `fix:` 修复 bug
- `docs:` 文档更新
- `style:` 代码格式调整
- `refactor:` 重构
- `test:` 测试相关
- `chore:` 构建/工具相关

示例：

```
feat: 添加模型导出功能
fix: 修复图表渲染问题
docs: 更新 README
```

## 需要帮助？

- 查看 `SETUP.md` 获取详细使用说明
- 查看 `PROJECT_STRUCTURE.md` 了解项目架构
- 查看各文件中的注释
- 查阅相关技术文档：
  - [Vue 3](https://vuejs.org/)
  - [TypeScript](https://www.typescriptlang.org/)
  - [Pinia](https://pinia.vuejs.org/)
  - [Element Plus](https://element-plus.org/)
  - [ECharts](https://echarts.apache.org/)
  - [Tailwind CSS](https://tailwindcss.com/)

祝你开发愉快！🎉
