#!/usr/bin/env pwsh

# 槟界系统 - JAR包复制脚本
# 功能：将maven打包后的jar包复制为临时文件

# 设置参数
$sourceJar = "haozi-admin/target/haozi-admin.jar"
$targetDir = "haozi-admin"
$targetFile = "haozi-admin.jar.tmp"

# 检查源文件是否存在
if (-not (Test-Path $sourceJar)) {
    Write-Host "错误: 源文件不存在: $sourceJar" -ForegroundColor Red
    Write-Host "请先运行 'mvn clean package' 进行打包" -ForegroundColor Yellow
    exit 1
}

# 创建目标目录（如果不存在）
if (-not (Test-Path $targetDir)) {
    Write-Host "创建目录: $targetDir" -ForegroundColor Green
    New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
}

# 复制文件
$targetPath = Join-Path $targetDir $targetFile
Write-Host "正在复制文件..." -ForegroundColor Cyan
Write-Host "源文件: $sourceJar" -ForegroundColor Cyan
Write-Host "目标文件: $targetPath" -ForegroundColor Cyan

try {
    Copy-Item -Path $sourceJar -Destination $targetPath -Force
    Write-Host "✅ 文件复制成功!" -ForegroundColor Green
    Write-Host "临时文件位置: $targetPath" -ForegroundColor Blue
} catch {
    Write-Host "❌ 文件复制失败: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 显示文件信息
if (Test-Path $targetPath) {
    $fileInfo = Get-Item $targetPath
    Write-Host "`n文件信息:" -ForegroundColor Yellow
    Write-Host "文件大小: $([math]::Round($fileInfo.Length / 1MB, 2)) MB" -ForegroundColor White
    Write-Host "创建时间: $($fileInfo.CreationTime)" -ForegroundColor White
    Write-Host "修改时间: $($fileInfo.LastWriteTime)" -ForegroundColor White
}