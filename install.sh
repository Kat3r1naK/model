#!/bin/bash

# 学习追踪模型对比系统 - 安装脚本

echo "🚀 学习追踪模型对比系统 - 安装向导"
echo "=================================="
echo ""

# 检查 Node.js
echo "📦 检查 Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ 错误：未检测到 Node.js"
    echo "   请先安装 Node.js (v18+): https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v)
echo "✅ Node.js 版本: $NODE_VERSION"
echo ""

# 检查 pnpm
echo "📦 检查 pnpm..."
if ! command -v pnpm &> /dev/null; then
    echo "⚠️  未检测到 pnpm"
    echo "🔧 正在安装 pnpm..."
    npm install -g pnpm
    if [ $? -eq 0 ]; then
        echo "✅ pnpm 安装成功"
    else
        echo "❌ pnpm 安装失败，请手动安装: npm install -g pnpm"
        exit 1
    fi
else
    PNPM_VERSION=$(pnpm -v)
    echo "✅ pnpm 版本: $PNPM_VERSION"
fi
echo ""

# 安装依赖
echo "📦 安装项目依赖..."
pnpm install

if [ $? -eq 0 ]; then
    echo "✅ 依赖安装成功"
else
    echo "❌ 依赖安装失败"
    exit 1
fi
echo ""

# 初始化 Husky
echo "🎣 初始化 Git hooks (Husky)..."
pnpm prepare

if [ $? -eq 0 ]; then
    echo "✅ Husky 初始化成功"
else
    echo "⚠️  Husky 初始化失败（如果不使用 Git 可以忽略）"
fi
echo ""

# 完成
echo "=================================="
echo "✨ 安装完成！"
echo ""
echo "🎯 下一步操作："
echo ""
echo "   启动开发服务器:"
echo "   $ pnpm dev"
echo ""
echo "   构建生产版本:"
echo "   $ pnpm build"
echo ""
echo "   运行代码检查:"
echo "   $ pnpm lint"
echo ""
echo "📖 更多信息请查看："
echo "   - README.md - 项目说明"
echo "   - QUICKSTART.md - 快速开始"
echo "   - SETUP.md - 详细配置"
echo ""
echo "🎉 祝你开发愉快！"

