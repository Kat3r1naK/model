# 贡献指南

感谢你考虑为学习追踪模型对比系统做出贡献！

## 🤝 如何贡献

### 报告 Bug

如果你发现了 bug，请创建一个 issue，包含：

1. **Bug 描述**：清晰简洁的描述
2. **复现步骤**：详细的复现步骤
3. **期望行为**：你期望发生什么
4. **实际行为**：实际发生了什么
5. **截图**：如果适用，添加截图
6. **环境信息**：
   - 操作系统
   - Node.js 版本
   - 浏览器版本

### 提出新功能

如果你有新功能的想法：

1. 先创建一个 issue 讨论
2. 描述功能的用途和价值
3. 提供示例或设计草图
4. 等待团队反馈

### 提交代码

#### 1. Fork 项目

```bash
# 在 GitHub 上 Fork 项目
# 然后克隆你的 fork
git clone https://github.com/your-username/model.git
cd model
```

#### 2. 创建分支

```bash
# 从 main 创建新分支
git checkout -b feature/your-feature-name

# 或者修复 bug
git checkout -b fix/bug-description
```

分支命名规范：
- `feature/xxx` - 新功能
- `fix/xxx` - Bug 修复
- `docs/xxx` - 文档更新
- `style/xxx` - 代码格式调整
- `refactor/xxx` - 重构
- `test/xxx` - 测试相关
- `chore/xxx` - 构建/工具相关

#### 3. 安装依赖

```bash
pnpm install
```

#### 4. 开发

```bash
# 启动开发服务器
pnpm dev

# 在另一个终端运行 TypeScript 类型检查
pnpm build --watch
```

#### 5. 编写代码

遵循以下规范：

**代码风格**
- 使用 TypeScript
- 遵循 ESLint 规则
- 使用 Prettier 格式化
- 添加必要的注释
- 使用有意义的变量名

**Vue 组件**
- 使用 Composition API
- 使用 `<script setup>` 语法
- Props 和 Emits 使用 TypeScript 类型
- 组件名使用 PascalCase

**文件组织**
```
src/
├── components/        # UI 组件
├── stores/           # 状态管理
├── types/            # 类型定义
├── utils/            # 工具函数（如需要）
├── api/              # API 调用（如需要）
└── composables/      # 可组合函数（如需要）
```

#### 6. 测试

```bash
# 运行 lint
pnpm lint

# 运行类型检查
pnpm build
```

#### 7. 提交代码

使用约定式提交（Conventional Commits）：

```bash
git add .
git commit -m "feat: add new feature"
```

提交类型：
- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式调整（不影响功能）
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建/工具相关
- `ci`: CI 配置

示例：
```bash
feat: 添加模型导出功能
fix: 修复图表渲染问题
docs: 更新 README
style: 格式化代码
refactor: 重构状态管理逻辑
perf: 优化图表渲染性能
test: 添加单元测试
chore: 更新依赖版本
```

#### 8. 推送到 GitHub

```bash
git push origin feature/your-feature-name
```

#### 9. 创建 Pull Request

1. 在 GitHub 上创建 Pull Request
2. 填写 PR 模板：
   - 描述你的更改
   - 相关的 issue 编号
   - 测试说明
   - 截图（如果适用）
3. 等待代码审查

## 📝 代码审查

Pull Request 会经过以下审查：

1. **代码质量**
   - ESLint 检查通过
   - TypeScript 类型正确
   - 代码风格一致

2. **功能完整性**
   - 功能按预期工作
   - 没有破坏现有功能
   - 边界情况处理

3. **文档**
   - 代码有适当注释
   - 更新相关文档
   - 添加使用示例

4. **性能**
   - 没有明显性能问题
   - 合理的算法复杂度

## 🎨 设计规范

### UI 设计原则

1. **一致性**
   - 使用 Element Plus 组件
   - 统一的间距和颜色
   - 一致的交互模式

2. **简洁性**
   - 界面简洁明了
   - 减少不必要的元素
   - 突出重要信息

3. **响应式**
   - 支持不同屏幕尺寸
   - 移动端友好

### 颜色规范

主题色：
- 主色：`#3b82f6` (蓝色)
- 成功：`#10b981` (绿色)
- 警告：`#f59e0b` (橙色)
- 错误：`#ef4444` (红色)

背景色：
- 深色背景：`#0f172a`, `#1e293b`
- 面板背景：`rgba(30, 41, 59, 0.6)`
- 边框：`rgba(71, 85, 105, 0.5)`

文字色：
- 主文字：`#e2e8f0`
- 次要文字：`#94a3b8`
- 辅助文字：`#64748b`

### 间距规范

使用 Tailwind 的间距系统：
- xs: `0.5rem` (8px)
- sm: `0.75rem` (12px)
- md: `1rem` (16px)
- lg: `1.5rem` (24px)
- xl: `2rem` (32px)

## 🧪 测试指南

（待添加单元测试框架后）

### 单元测试

```typescript
// 示例：测试工具函数
import { describe, it, expect } from 'vitest'
import { generateModelData } from '@/stores/modelStore'

describe('generateModelData', () => {
  it('should generate correct number of data points', () => {
    const data = generateModelData('bkt', 60)
    expect(data).toHaveLength(60)
  })
})
```

### 组件测试

```typescript
// 示例：测试组件
import { mount } from '@vue/test-utils'
import ModelSelector from '@/components/ModelSelector.vue'

describe('ModelSelector', () => {
  it('renders correctly', () => {
    const wrapper = mount(ModelSelector)
    expect(wrapper.find('h3').text()).toBe('模型选择')
  })
})
```

## 📚 开发资源

### 技术文档

- [Vue 3 文档](https://vuejs.org/)
- [TypeScript 文档](https://www.typescriptlang.org/)
- [Pinia 文档](https://pinia.vuejs.org/)
- [Element Plus 文档](https://element-plus.org/)
- [ECharts 文档](https://echarts.apache.org/)
- [Tailwind CSS 文档](https://tailwindcss.com/)
- [Vite 文档](https://vitejs.dev/)

### 学习追踪模型

- [BKT 论文](https://en.wikipedia.org/wiki/Bayesian_Knowledge_Tracing)
- [PFA 论文](https://pact.cs.cmu.edu/pubs/AIED%202009%20final%20Pavlik%20Cen%20Keodinger%20corrected.pdf)
- [IRT 文档](https://en.wikipedia.org/wiki/Item_response_theory)

## 💬 社区

### 提问

- 使用 GitHub Issues 提问
- 提供详细的上下文
- 包含代码示例

### 讨论

- 使用 GitHub Discussions
- 分享想法和建议
- 帮助其他开发者

## 🏆 贡献者

感谢所有贡献者！

<!-- 可以使用 all-contributors 自动生成贡献者列表 -->

## 📜 行为准则

### 我们的承诺

为了营造一个开放和友好的环境，我们承诺：

- 尊重不同观点和经验
- 接受建设性批评
- 关注对社区最有利的事情
- 对其他社区成员表现同理心

### 不可接受的行为

- 使用性化的语言或图像
- 侮辱/贬低性评论和人身攻击
- 公开或私下骚扰
- 未经许可发布他人的私人信息
- 其他不道德或不专业的行为

## 📄 许可证

通过贡献代码，你同意你的贡献将在 MIT 许可证下发布。

## ❓ 问题？

如有任何问题，请：
1. 查看文档
2. 搜索已有 issues
3. 创建新 issue

---

再次感谢你的贡献！🎉

