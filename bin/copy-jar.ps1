#!/usr/bin/env pwsh

# 槟界系统 - JAR包复制脚本
# 功能：将maven打包后的jar包复制为临时文件

# 获取脚本所在目录的上级目录作为项目根目录
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir

# 设置参数
$sourceJar = Join-Path $ProjectRoot "haozi-admin/target/haozi-admin.jar"
$distDir = Join-Path $ProjectRoot "dist"
$targetFile = "haozi-admin.jar.tmp"
$targetPath = Join-Path $distDir $targetFile

Write-Host "🚀 开始复制 haozi-admin JAR 文件..." -ForegroundColor Green
Write-Host "📁 脚本目录: $ScriptDir" -ForegroundColor Gray
Write-Host "📁 项目根目录: $ProjectRoot" -ForegroundColor Gray
Write-Host "📦 输出目录: $distDir" -ForegroundColor Gray

# 检查源文件是否存在
if (-not (Test-Path $sourceJar)) {
    Write-Host "❌ 错误: 源文件不存在: $sourceJar" -ForegroundColor Red
    Write-Host "💡 请先运行 'mvn clean package' 进行打包" -ForegroundColor Yellow
    exit 1
}

# 创建 dist 目录（如果不存在）
if (-not (Test-Path $distDir)) {
    Write-Host "📁 创建 dist 目录: $distDir" -ForegroundColor Blue
    New-Item -ItemType Directory -Path $distDir -Force | Out-Null
}

# 复制文件
Write-Host "📋 正在复制文件..." -ForegroundColor Cyan
Write-Host "   源文件: $sourceJar" -ForegroundColor Gray
Write-Host "   目标文件: $targetPath" -ForegroundColor Gray

try {
    Copy-Item -Path $sourceJar -Destination $targetPath -Force
    Write-Host "✅ 文件复制成功!" -ForegroundColor Green
    Write-Host "📦 临时文件位置: $targetPath" -ForegroundColor Blue
} catch {
    Write-Host "❌ 文件复制失败: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 显示文件信息
if (Test-Path $targetPath) {
    $fileInfo = Get-Item $targetPath
    Write-Host "`n📋 文件信息:" -ForegroundColor Yellow
    Write-Host "   文件大小: $([math]::Round($fileInfo.Length / 1MB, 2)) MB" -ForegroundColor White
    Write-Host "   创建时间: $($fileInfo.CreationTime)" -ForegroundColor White
    Write-Host "   修改时间: $($fileInfo.LastWriteTime)" -ForegroundColor White

    Write-Host "`n💡 后续部署提示:" -ForegroundColor Cyan
    Write-Host "   JAR 文件已复制到 dist/$targetFile" -ForegroundColor Gray
    Write-Host "   可以将其上传到服务器进行部署" -ForegroundColor Gray
}