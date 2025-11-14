#!/bin/bash

# haozi-ui 服务器部署脚本
# 自动完成依赖安装和 PM2 重启

set -e  # 遇到错误时退出

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
UI_DIR="${PROJECT_ROOT}/haozi-ui"

if [ ! -d "$UI_DIR" ]; then
    echo "❌ 错误: 未找到 haozi-ui 目录: $UI_DIR"
    exit 1
fi

echo "🚀 开始部署 haozi-ui..."
echo "📂 切换到 $UI_DIR"
cd "$UI_DIR"

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误: 未找到 package.json，请确认 haozi-ui 项目完整"
    exit 1
fi

if [ ! -f "ecosystem.config.js" ]; then
    echo "❌ 错误: 未找到 ecosystem.config.js，请确保 PM2 配置文件存在"
    exit 1
fi

echo "📁 当前目录: $(pwd)"
echo "📋 项目文件列表:"
ls -la

# 检查 Node.js 环境
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未找到 Node.js，请先安装 Node.js"
    exit 1
fi

if ! command -v yarn &> /dev/null; then
    echo "❌ 错误: 未找到 Yarn，请先安装 Yarn"
    exit 1
fi

if ! command -v pm2 &> /dev/null; then
    echo "❌ 错误: 未找到 PM2，请先安装 PM2: npm install -g pm2"
    exit 1
fi

echo "✅ 环境检查通过"
echo "   Node.js: $(node --version)"
echo "   Yarn: $(yarn --version)"
echo "   PM2: $(pm2 --version)"

# 备份当前的 node_modules（如果存在）
if [ -d "node_modules" ]; then
    echo "💾 备份现有的 node_modules..."
    mv node_modules node_modules.backup.$(date +%Y%m%d_%H%M%S)
fi

# 安装生产依赖
echo "📦 安装依赖（包含构建所需 devDependencies）..."
echo "   执行命令: yarn install --frozen-lockfile"
yarn install --frozen-lockfile

# 检查依赖安装是否成功
if [ ! -d "node_modules" ]; then
    echo "❌ 错误: 依赖安装失败"
    exit 1
fi

echo "✅ 依赖安装完成"

# 检查 ecosystem.config.js 配置文件
echo "🔧 检查 PM2 配置文件..."
if [ ! -s "ecosystem.config.js" ]; then
    echo "❌ 错误: ecosystem.config.js 文件为空"
    exit 1
fi

echo "   配置文件内容预览:"
head -10 ecosystem.config.js

# 确保生产环境变量存在并加载，用于后续构建注入
if [ ! -f ".env.production" ]; then
    echo "❌ 错误: 未找到 .env.production，请在构建前配置生产环境变量"
    exit 1
fi

echo "🌱 加载生产环境变量 (.env.production)..."
set -a
source .env.production
set +a
echo "   NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL:-未定义}"

# 生产构建，确保打包产物使用最新的环境变量
echo "🏗️ 构建生产包..."
NODE_ENV=production yarn build

echo "✅ 生产构建完成"

# 检查 PM2 中是否已存在 haozi-ui 进程
echo "🔍 检查 PM2 进程状态..."
if pm2 list | grep -q "haozi-ui"; then
    echo "🔄 发现现有 haozi-ui 进程，正在重启..."
    echo "   执行命令: pm2 restart ecosystem.config.js"
    pm2 restart ecosystem.config.js

    # 等待进程重启完成
    echo "⏳ 等待进程启动..."
    sleep 5
else
    echo "🆕 未找到 haozi-ui 进程，正在启动..."
    echo "   执行命令: pm2 start ecosystem.config.js"
    pm2 start ecosystem.config.js

    # 等待进程启动完成
    echo "⏳ 等待进程启动..."
    sleep 5
fi

# 检查进程状态
echo "📊 检查进程状态..."
pm2 list | grep haozi-ui

# 验证进程是否正常运行
PROCESS_STATUS=$(pm2 jlist | jq -r '.[] | select(.name=="haozi-ui") | .pm2_env.status' 2>/dev/null || echo "unknown")

if [ "$PROCESS_STATUS" = "online" ]; then
    echo "✅ 进程运行正常"
elif [ "$PROCESS_STATUS" = "errored" ]; then
    echo "❌ 进程启动失败，请检查日志"
else
    echo "⚠️  进程状态未知: $PROCESS_STATUS"
fi

# 显示日志
echo "📋 显示最近的日志..."
pm2 logs haozi-ui --lines 10

# 检查端口是否正常监听
echo "🔍 检查端口监听状态..."
if command -v netstat &> /dev/null; then
    netstat -tlnp | grep :3000 || echo "   端口 3000 未监听"
elif command -v ss &> /dev/null; then
    ss -tlnp | grep :3000 || echo "   端口 3000 未监听"
else
    echo "   无法检查端口状态（缺少 netstat 或 ss 命令）"
fi

echo "🎉 部署完成!"
echo ""
echo "💡 常用命令:"
echo "   查看进程状态: pm2 list"
echo "   查看日志: pm2 logs haozi-ui"
echo "   重启进程: pm2 restart haozi-ui"
echo "   停止进程: pm2 stop haozi-ui"
echo "   删除进程: pm2 delete haozi-ui"
echo ""
echo "🌐 应用访问地址: http://localhost:3000"
