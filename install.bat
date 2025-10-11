@echo off
chcp 65001 >nul
echo.
echo 🚀 学习追踪模型对比系统 - 安装向导
echo ==================================
echo.

REM 检查 Node.js
echo 📦 检查 Node.js...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ 错误：未检测到 Node.js
    echo    请先安装 Node.js (v18+^): https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo ✅ Node.js 版本: %NODE_VERSION%
echo.

REM 检查 pnpm
echo 📦 检查 pnpm...
where pnpm >nul 2>nul
if %errorlevel% neq 0 (
    echo ⚠️  未检测到 pnpm
    echo 🔧 正在安装 pnpm...
    call npm install -g pnpm
    if %errorlevel% equ 0 (
        echo ✅ pnpm 安装成功
    ) else (
        echo ❌ pnpm 安装失败，请手动安装: npm install -g pnpm
        pause
        exit /b 1
    )
) else (
    for /f "tokens=*" %%i in ('pnpm -v') do set PNPM_VERSION=%%i
    echo ✅ pnpm 版本: %PNPM_VERSION%
)
echo.

REM 安装依赖
echo 📦 安装项目依赖...
call pnpm install

if %errorlevel% equ 0 (
    echo ✅ 依赖安装成功
) else (
    echo ❌ 依赖安装失败
    pause
    exit /b 1
)
echo.

REM 初始化 Husky
echo 🎣 初始化 Git hooks (Husky^)...
call pnpm prepare

if %errorlevel% equ 0 (
    echo ✅ Husky 初始化成功
) else (
    echo ⚠️  Husky 初始化失败（如果不使用 Git 可以忽略）
)
echo.

REM 完成
echo ==================================
echo ✨ 安装完成！
echo.
echo 🎯 下一步操作：
echo.
echo    启动开发服务器:
echo    $ pnpm dev
echo.
echo    构建生产版本:
echo    $ pnpm build
echo.
echo    运行代码检查:
echo    $ pnpm lint
echo.
echo 📖 更多信息请查看：
echo    - README.md - 项目说明
echo    - QUICKSTART.md - 快速开始
echo    - SETUP.md - 详细配置
echo.
echo 🎉 祝你开发愉快！
echo.
pause

