# haozi-ui 部署文件打包脚本
# 将必要的部署文件压缩到 haozi-ui.zip

param(
    [string]$ProjectPath = "",
    [string]$OutputZip = "haozi-ui.zip"
)

# 设置错误处理
$ErrorActionPreference = "Stop"

# 获取脚本所在目录的上级目录作为项目根目录
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir

# 如果没有指定项目路径，使用默认值
if ([string]::IsNullOrEmpty($ProjectPath)) {
    $ProjectPath = Join-Path $ProjectRoot "haozi-ui"
}

# 创建 dist 目录
$DistDir = Join-Path $ProjectRoot "dist"
if (-not (Test-Path $DistDir)) {
    Write-Host "📁 创建 dist 目录: $DistDir" -ForegroundColor Blue
    New-Item -ItemType Directory -Path $DistDir -Force | Out-Null
}

# 设置输出文件路径（在 dist 目录）
$OutputZip = Join-Path $DistDir $OutputZip

Write-Host "🚀 开始打包 haozi-ui 部署文件..." -ForegroundColor Green
Write-Host "📁 脚本目录: $ScriptDir" -ForegroundColor Gray
Write-Host "📁 项目根目录: $ProjectRoot" -ForegroundColor Gray
Write-Host "📁 项目路径: $ProjectPath" -ForegroundColor Gray
Write-Host "📦 输出目录: $DistDir" -ForegroundColor Gray
Write-Host "📦 输出文件: $OutputZip" -ForegroundColor Gray

# 检查项目目录是否存在
if (-not (Test-Path $ProjectPath)) {
    Write-Host "❌ 错误: 找不到项目目录 '$ProjectPath'" -ForegroundColor Red
    Write-Host "💡 请确保在包含 haozi-ui 项目的目录中执行此脚本" -ForegroundColor Yellow
    exit 1
}

# 定义要包含的文件和目录
$filesToInclude = @(
    "$ProjectPath\.next",
    "$ProjectPath\public",
    "$ProjectPath\package.json",
    "$ProjectPath\ecosystem.config.js",
    "$ProjectPath\next.config.ts",
    "$ProjectPath\.env.production"
)

# 检查所有必要文件是否存在
$missingFiles = @()
foreach ($file in $filesToInclude) {
    if (-not (Test-Path $file)) {
        $missingFiles += $file
    }
}

if ($missingFiles.Count -gt 0) {
    Write-Host "❌ 错误: 以下文件不存在:" -ForegroundColor Red
    $missingFiles | ForEach-Object { Write-Host "   - $_" -ForegroundColor Red }
    exit 1
}

Write-Host "✅ 所有必要文件检查完成" -ForegroundColor Green

# 创建临时目录用于打包
$tempDir = "temp-haozi-ui-package"
if (Test-Path $tempDir) {
    Write-Host "🗑️  清理临时目录..." -ForegroundColor Yellow
    Remove-Item -Path $tempDir -Recurse -Force
}

New-Item -ItemType Directory -Path $tempDir | Out-Null

Write-Host "📁 复制文件到临时目录..." -ForegroundColor Blue

# 复制文件到临时目录，保持目录结构
foreach ($file in $filesToInclude) {
    $itemName = Split-Path $file -Leaf
    $destPath = "$tempDir\$itemName"

    Write-Host "   复制: $itemName" -ForegroundColor Gray

    if (Test-Path $file -PathType Container) {
        # 复制目录
        Copy-Item -Path $file -Destination $destPath -Recurse -Force
    } else {
        # 复制文件
        Copy-Item -Path $file -Destination $destPath -Force
    }
}

# 检查是否已存在输出文件并删除
if (Test-Path $OutputZip) {
    Write-Host "🗑️  删除现有的压缩包: $OutputZip" -ForegroundColor Yellow
    Remove-Item -Path $OutputZip -Force
}

# 创建压缩文件
Write-Host "📦 创建压缩包: $OutputZip" -ForegroundColor Blue

try {
    # 使用 PowerShell 5+ 的 Compress-Archive
    Compress-Archive -Path "$tempDir\*" -DestinationPath $OutputZip -Force

    # 检查压缩包是否创建成功
    if (Test-Path $OutputZip) {
        $zipSize = [math]::Round((Get-Item $OutputZip).Length / 1MB, 2)
        Write-Host "✅ 压缩包创建成功!" -ForegroundColor Green
        Write-Host "   文件名: $OutputZip" -ForegroundColor Gray
        Write-Host "   大小: $zipSize MB" -ForegroundColor Gray
        Write-Host "   位置: $(Resolve-Path $OutputZip)" -ForegroundColor Gray
    } else {
        throw "压缩包创建失败"
    }
}
catch {
    Write-Host "❌ 压缩失败: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
finally {
    # 清理临时目录
    if (Test-Path $tempDir) {
        Write-Host "🧹 清理临时目录..." -ForegroundColor Gray
        Remove-Item -Path $tempDir -Recurse -Force
    }
}

$OutputFileName = Split-Path $OutputZip -Leaf
Write-Host "🎉 打包完成! 可以将 dist/$OutputFileName 上传到服务器了。" -ForegroundColor Green

# 显示压缩包内容
Write-Host "`n📋 压缩包内容预览:" -ForegroundColor Cyan
$filesInZip = $filesToInclude | ForEach-Object { Split-Path $_ -Leaf }
$filesInZip | ForEach-Object { Write-Host "   - $_" -ForegroundColor Gray }

Write-Host "`n💡 部署提示:" -ForegroundColor Yellow
Write-Host "   1. 将 dist/$OutputFileName 上传到服务器" -ForegroundColor Gray
Write-Host "   2. 解压到 /root/project/haozi-ui/" -ForegroundColor Gray
Write-Host "   3. 运行: ../bin/deploy-server.sh" -ForegroundColor Green
Write-Host "   ⚠️  deploy-server.sh 会自动执行 yarn install --production 和 PM2 重启" -ForegroundColor Cyan