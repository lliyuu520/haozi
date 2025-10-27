#!/usr/bin/env tsx

/**
 * 菜单模块配置检查脚本
 * 用于验证菜单模块的完整性和正确性
 */

import * as fs from 'fs';
import * as path from 'path';

// 检查文件是否存在
function checkFileExists(filePath: string, description: string): boolean {
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${description}: ${filePath}`);
    return true;
  } else {
    console.log(`❌ ${description}: ${filePath} (文件不存在)`);
    return false;
  }
}

// 检查目录结构
function checkDirectoryStructure() {
  console.log('🔍 检查目录结构...\n');

  const requiredFiles = [
    {
      path: 'app/(system)/system/menu/page.tsx',
      description: '菜单管理页面'
    },
    {
      path: 'app/(system)/system/menu/modal/[...slug]/page.tsx',
      description: '菜单模态框页面'
    },
    {
      path: 'app/(system)/system/menu/components/MenuForm.tsx',
      description: '菜单表单组件'
    },
    {
      path: 'app/(system)/system/menu/components/MenuTable.tsx',
      description: '菜单表格组件'
    },
    {
      path: 'components/ui/ReactRouteModal.tsx',
      description: '路由模态框组件'
    },
    {
      path: 'hooks/useRouteModalV2.ts',
      description: '路由模态框Hook'
    },
    {
      path: 'utils/routeHelper.ts',
      description: '路由工具类'
    },
    {
      path: 'services/menu.ts',
      description: '菜单服务'
    },
    {
      path: 'types/menu.ts',
      description: '菜单类型定义'
    }
  ];

  let allFilesExist = true;

  requiredFiles.forEach(({ path, description }) => {
    const fullPath = path.join(process.cwd(), path);
    if (!checkFileExists(fullPath, description)) {
      allFilesExist = false;
    }
  });

  return allFilesExist;
}

// 检查关键函数导出
function checkExports() {
  console.log('\n🔍 检查关键导出...\n');

  try {
    // 检查服务导出
    const menuServicePath = path.join(process.cwd(), 'services/menu.ts');
    if (fs.existsSync(menuServicePath)) {
      const menuServiceContent = fs.readFileSync(menuServicePath, 'utf-8');

      const requiredExports = [
        'MenuType',
        'OpenStyle',
        'getMenuListNavigable',
        'createMenuWithNavigation',
        'updateMenuWithNavigation',
        'deleteMenu',
        'MenuNavigationHelper',
        'NavigableMenuItem'
      ];

      requiredExports.forEach(exportName => {
        if (menuServiceContent.includes(`export ${exportName}`) ||
            menuServiceContent.includes(`export { ${exportName} }`) ||
            menuServiceContent.includes(`export.*{.*${exportName}`)) {
          console.log(`✅ 服务导出: ${exportName}`);
        } else {
          console.log(`❌ 服务导出缺失: ${exportName}`);
        }
      });
    }

    // 检查Hook导出
    const hookPath = path.join(process.cwd(), 'hooks/useRouteModalV2.ts');
    if (fs.existsSync(hookPath)) {
      const hookContent = fs.readFileSync(hookPath, 'utf-8');

      const requiredHooks = [
        'useRouteModalV2',
        'useSimpleRouteModal',
        'useMultipleRouteModals'
      ];

      requiredHooks.forEach(hookName => {
        if (hookContent.includes(`export.*function ${hookName}`) ||
            hookContent.includes(`export.*${hookName}`)) {
          console.log(`✅ Hook导出: ${hookName}`);
        } else {
          console.log(`❌ Hook导出缺失: ${hookName}`);
        }
      });
    }

  } catch (error) {
    console.log(`❌ 检查导出时出错: ${error}`);
  }
}

// 检查数据库脚本
function checkDatabaseScripts() {
  console.log('\n🔍 检查数据库脚本...\n');

  const dbScriptPath = path.join(process.cwd(), 'database/menu_update_sample.sql');
  checkFileExists(dbScriptPath, '菜单数据库更新脚本');
}

// 检查文档
function checkDocumentation() {
  console.log('\n🔍 检查文档...\n');

  const docs = [
    {
      path: 'docs/MENU_MODULE_GUIDE.md',
      description: '菜单模块使用指南'
    },
    {
      path: 'docs/ROUTE_MODAL_GUIDE.md',
      description: '路由模态框指南'
    },
    {
      path: 'docs/REACT_STYLE_URL_GUIDE.md',
      description: 'React风格URL指南'
    }
  ];

  docs.forEach(({ path, description }) => {
    const fullPath = path.join(process.cwd(), path);
    checkFileExists(fullPath, description);
  });
}

// 生成启动指南
function generateStartupGuide() {
  console.log('\n🚀 启动指南:\n');
  console.log('1. 确保数据库已更新:');
  console.log('   - 运行 database/menu_update_sample.sql');
  console.log('   - 检查菜单URL是否为 system/menu/page 格式\n');

  console.log('2. 启动前端应用:');
  console.log('   cd haozi-ui-antd');
  console.log('   npm run dev\n');

  console.log('3. 访问菜单管理:');
  console.log('   http://localhost:3000/system/menu/page\n');

  console.log('4. 测试功能:');
  console.log('   ✅ 点击"新建菜单" → 应弹出创建模态框');
  console.log('   ✅ 点击"编辑"按钮 → 应弹出编辑模态框');
  console.log('   ✅ 点击"查看"按钮 → 应弹出只读模态框');
  console.log('   ✅ 浏览器后退 → 应关闭模态框或返回上页\n');

  console.log('5. 检查URL:');
  console.log('   ✅ /system/menu/page - 列表页面');
  console.log('   ✅ /system/menu/modal/create - 创建模态框');
  console.log('   ✅ /system/menu/modal/edit/123 - 编辑模态框');
  console.log('   ✅ /system/menu/modal/view/123 - 查看模态框\n');
}

// 主函数
function main() {
  console.log('🔧 菜单模块配置检查工具\n');
  console.log('=====================================\n');

  const structureOk = checkDirectoryStructure();
  checkExports();
  checkDatabaseScripts();
  checkDocumentation();

  if (structureOk) {
    generateStartupGuide();
    console.log('✅ 菜单模块配置检查完成！');
  } else {
    console.log('\n❌ 发现缺失文件，请检查并修复后重试。');
  }
}

// 运行检查
if (require.main === module) {
  main();
}

export { main as checkMenuModule };