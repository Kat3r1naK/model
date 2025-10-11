# 项目结构说明

## 目录树

```
model/
├── .husky/                      # Git hooks
│   └── pre-commit              # 提交前钩子（运行 lint-staged）
├── .vscode/                     # VSCode 配置
│   ├── extensions.json         # 推荐的扩展
│   └── settings.json           # 编辑器设置
├── src/                         # 源代码目录
│   ├── assets/                 # 静态资源
│   │   └── logo.svg           # Logo 图标
│   ├── components/             # Vue 组件
│   │   ├── ModelSelector.vue  # 模型选择组件
│   │   ├── DatasetSelector.vue # 数据集选择组件
│   │   └── ResultChart.vue    # 结果图表组件
│   ├── stores/                 # Pinia 状态管理
│   │   └── modelStore.ts      # 模型状态管理
│   ├── styles/                 # 样式文件
│   │   └── main.css           # 全局样式（包含 Tailwind）
│   ├── types/                  # TypeScript 类型定义
│   │   └── index.ts           # 类型声明
│   ├── App.vue                 # 根组件
│   ├── main.ts                 # 应用入口
│   └── vite-env.d.ts          # Vite 环境类型声明
├── .editorconfig               # 编辑器配置
├── .eslintignore               # ESLint 忽略文件
├── .eslintrc.cjs               # ESLint 配置
├── .gitignore                  # Git 忽略文件
├── .prettierignore             # Prettier 忽略文件
├── .prettierrc.json            # Prettier 配置
├── index.html                  # HTML 入口
├── package.json                # 项目配置和依赖
├── postcss.config.js           # PostCSS 配置
├── PROJECT_STRUCTURE.md        # 本文件
├── README.md                   # 项目说明
├── SETUP.md                    # 安装和使用指南
├── tailwind.config.js          # Tailwind CSS 配置
├── tsconfig.json               # TypeScript 配置
├── tsconfig.node.json          # Node 环境 TypeScript 配置
└── vite.config.ts              # Vite 配置
```

## 核心文件说明

### 配置文件

#### `package.json`
- 定义项目依赖和脚本命令
- 配置 lint-staged 钩子

#### `tsconfig.json`
- TypeScript 编译选项
- 路径别名配置 (@/ → src/)

#### `vite.config.ts`
- Vite 构建工具配置
- 插件和路径别名设置

#### `tailwind.config.js`
- Tailwind CSS 配置
- 禁用 preflight 以兼容 Element Plus

#### `.eslintrc.cjs`
- ESLint 代码检查规则
- Vue3 + TypeScript 规则集

#### `.prettierrc.json`
- 代码格式化规则
- 统一代码风格

### 源代码文件

#### `src/main.ts`
入口文件，负责：
- 创建 Vue 应用实例
- 注册 Pinia、Element Plus
- 注册 Element Plus 图标
- 挂载应用

#### `src/App.vue`
根组件，包含：
- 页面布局和标题
- 模型和数据集选择器
- 操作按钮（运行对比、清空结果）
- 结果图表展示
- 模型说明卡片

#### `src/stores/modelStore.ts`
Pinia 状态管理，提供：
- 模型和数据集列表
- 选择状态管理
- 模型运行逻辑
- 结果数据生成和存储

#### `src/types/index.ts`
TypeScript 类型定义：
- `Model` - 模型类型
- `Dataset` - 数据集类型
- `DataPoint` - 数据点类型
- `ModelResult` - 模型结果类型
- `ComparisonResult` - 对比结果类型

### 组件说明

#### `ModelSelector.vue`
模型选择组件：
- 支持多选（checkbox）
- 显示模型完整名称和描述
- 美化的交互效果

#### `DatasetSelector.vue`
数据集选择组件：
- 单选（radio）
- 显示数据集名称和中文描述
- 提示信息

#### `ResultChart.vue`
图表展示组件：
- 使用 ECharts 绘制曲线图
- 支持多模型对比
- 交互式提示
- 响应式设计

## 数据流

```
用户操作
  ↓
选择模型和数据集 (ModelSelector/DatasetSelector)
  ↓
更新 Pinia Store (selectedModels/selectedDataset)
  ↓
点击"运行对比"按钮 (App.vue)
  ↓
调用 runComparison() (modelStore.ts)
  ↓
生成模拟数据 generateModelData()
  ↓
更新 currentResult (Pinia Store)
  ↓
触发 ResultChart 更新 (watch currentResult)
  ↓
渲染 ECharts 图表
```

## 样式方案

### Tailwind CSS
- 用于布局和间距
- 响应式网格系统
- 工具类样式

### Element Plus
- UI 组件库
- 按钮、复选框、单选框等
- 深色主题支持

### 自定义 CSS
- 组件级 scoped 样式
- 半透明背景和模糊效果
- 悬停动画

### 主题色
- 主色调：蓝色 (#3b82f6)
- 背景：深蓝灰色渐变
- 文字：浅灰白色
- 强调色：红色、绿色（对应不同模型）

## 扩展建议

### 1. 后端集成
- 创建 `src/api/` 目录
- 添加 axios 或 fetch 封装
- 实现真实的模型训练和评估

### 2. 更多图表
- 添加混淆矩阵
- ROC 曲线
- 学习曲线对比

### 3. 数据管理
- 支持上传自定义数据集
- 数据预处理和验证
- 数据可视化

### 4. 模型配置
- 超参数调整界面
- 模型训练历史
- 保存和加载模型

### 5. 导出功能
- 导出图表为图片
- 导出结果为 PDF 报告
- 导出数据为 CSV

### 6. 权限管理
- 用户登录/注册
- 项目/实验管理
- 协作功能

## 命令速查

```bash
# 安装依赖
pnpm install

# 开发
pnpm dev

# 构建
pnpm build

# 代码检查
pnpm lint

# 格式化
pnpm format

# 初始化 Git hooks
pnpm prepare
```

## 技术栈版本

- Vue: 3.4.21
- TypeScript: 5.4.2
- Vite: 5.1.5
- Pinia: 2.1.7
- Element Plus: 2.6.1
- ECharts: 5.5.0
- Tailwind CSS: 3.4.1
- ESLint: 8.57.0
- Prettier: 3.2.5

