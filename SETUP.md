# 安装和使用指南

## 快速开始

### 1. 安装依赖

确保你已经安装了 Node.js (v18+) 和 pnpm。如果没有安装 pnpm，可以运行：

```bash
npm install -g pnpm
```

然后在项目根目录安装依赖：

```bash
pnpm install
```

### 2. 初始化 Husky

```bash
pnpm prepare
```

### 3. 启动开发服务器

```bash
pnpm dev
```

浏览器会自动打开 http://localhost:3000

## 使用说明

### 模型选择

在左侧"模型选择"区域，可以勾选一个或多个模型：
- **BKT** - 贝叶斯知识追踪
- **PFA** - 表现因素分析
- **IRT** - 题目反应理论

### 数据集选择

在右侧"数据集选择"区域，选择一个数据集：
- **Algebra I** - 代数一
- **Geometry** - 几何
- **Programming 101** - 编程入门

### 运行对比

1. 至少选择一个模型和一个数据集
2. 点击"运行对比"按钮
3. 系统会模拟运行选中的模型，并在下方显示准确率曲线图
4. 可以通过图表图例切换显示/隐藏特定模型的曲线

### 清空结果

点击"清空结果"按钮可以清除当前显示的图表

## 项目命令

```bash
# 开发
pnpm dev

# 构建
pnpm build

# 预览构建结果
pnpm preview

# 代码检查
pnpm lint

# 代码格式化
pnpm format
```

## 技术特性

### 代码质量保证

- **ESLint**: 自动检查代码规范
- **Prettier**: 自动格式化代码
- **Husky**: Git 提交前自动运行检查和格式化
- **TypeScript**: 提供类型安全

### 状态管理

使用 Pinia 进行状态管理，主要包括：
- 模型列表和选择状态
- 数据集列表和选择状态
- 运行结果和历史记录

### 样式方案

- **Tailwind CSS**: 实用优先的 CSS 框架
- **Element Plus**: 提供美观的 UI 组件
- **深色主题**: 现代化的深色界面

### 数据可视化

使用 ECharts 绘制交互式图表，支持：
- 多条曲线对比
- 鼠标悬停查看详细数据
- 平滑曲线动画
- 响应式布局

## 扩展功能建议

可以考虑添加以下功能：

1. **导出功能**
   - 导出图表为图片
   - 导出数据为 CSV

2. **历史记录**
   - 保存多次运行结果
   - 比较不同时间的运行结果

3. **真实数据集**
   - 连接后端 API
   - 上传自定义数据集

4. **更多模型**
   - 添加更多学习追踪模型
   - 支持自定义模型参数

5. **更多指标**
   - 除了 Accuracy，还可以显示 Precision、Recall、F1-Score 等
   - 添加模型性能对比表格

6. **响应式优化**
   - 移动端适配
   - 平板端优化

## 故障排除

### 端口占用

如果 3000 端口被占用，可以在 `vite.config.ts` 中修改端口号

### 依赖安装失败

尝试清除缓存后重新安装：

```bash
pnpm store prune
rm -rf node_modules
pnpm install
```

### TypeScript 错误

确保已安装所有类型定义：

```bash
pnpm install -D @types/node
```

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

代码会在提交时自动进行 lint 和格式化检查。

