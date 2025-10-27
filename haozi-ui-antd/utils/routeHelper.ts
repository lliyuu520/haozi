'use client';

/**
 * 路由工具类 - 支持React风格URL转换
 * @author lliyuu520
 */
export class RouteHelper {
  /**
   * 将后端URL转换为前端路由路径
   * @param backendUrl 后端URL，如 "system/menu/page"
   * @returns 前端路由路径，如 "/system/menu/page"
   */
  static generateRoute(backendUrl: string): string {
    if (!backendUrl) return '/';
    return backendUrl.startsWith('/') ? backendUrl : `/${backendUrl}`;
  }

  /**
   * 生成模态框路由路径
   * @param menuUrl 菜单URL，如 "system/menu/page"
   * @param action 操作类型，如 "create" 或 "edit"
   * @param id 可选的ID参数
   * @returns 模态框路由路径，如 "/system/menu/modal/create" 或 "/system/menu/modal/edit/123"
   */
  static generateModalRoute(menuUrl: string, action: string, id?: string): string {
    const basePath = menuUrl.replace('/page', '');
    const modalPath = `/${basePath}/modal/${action}`;
    return id ? `${modalPath}/${id}` : modalPath;
  }

  /**
   * 生成返回基础路径
   * @param menuUrl 菜单URL
   * @returns 基础路径，如 "/system/menu"
   */
  static generateBasePath(menuUrl: string): string {
    return `/${menuUrl.replace('/page', '')}`;
  }

  /**
   * 解析面包屑路径
   * @param menuUrl 菜单URL
   * @returns 面包屑数组，如 ["system", "menu"]
   */
  static parseBreadcrumbs(menuUrl: string): string[] {
    return menuUrl
      .replace('/page', '')
      .split('/')
      .filter(Boolean);
  }

  /**
   * 检查是否为页面路由
   * @param url URL字符串
   * @returns 是否为页面路由
   */
  static isPageRoute(url: string): boolean {
    return url.endsWith('/page');
  }

  /**
   * 提取模块路径
   * @param menuUrl 菜单URL
   * @returns 模块路径，如 "system/menu"
   */
  static extractModulePath(menuUrl: string): string {
    return menuUrl.replace('/page', '');
  }

  /**
   * 从当前路径提取基础路径
   * @param currentPath 当前路径
   * @returns 基础路径
   */
  static extractBasePath(currentPath: string): string {
    // 移除模态框路径部分，返回基础路径
    return currentPath.replace(/\/modal\/[^\/]*$/, '').replace(/\/modal\/[^\/]*\/[^\/]*$/, '');
  }

  /**
   * 生成菜单导航对象
   * @param menuUrl 菜单URL
   * @returns 菜单导航对象
   */
  static createMenuNavigation(menuUrl: string) {
    return {
      href: this.generateRoute(menuUrl),
      basePath: this.generateBasePath(menuUrl),
      modal: {
        create: this.generateModalRoute(menuUrl, 'create'),
        edit: (id: string) => this.generateModalRoute(menuUrl, 'edit', id)
      },
      breadcrumbs: this.parseBreadcrumbs(menuUrl),
      modulePath: this.extractModulePath(menuUrl)
    };
  }

  /**
   * 验证URL格式
   * @param url URL字符串
   * @returns 是否为有效的React风格URL
   */
  static isValidReactUrl(url: string): boolean {
    // 检查是否符合 module/submodule/page 格式
    const reactUrlPattern = /^[a-zA-Z][a-zA-Z0-9_-]*(\/[a-zA-Z][a-zA-Z0-9_-]*)*\/page$/;
    return reactUrlPattern.test(url);
  }

  /**
   * 标准化URL格式
   * @param url 原始URL
   * @returns 标准化后的URL
   */
  static normalizeUrl(url: string): string {
    if (!url) return '';

    // 移除开头的斜杠，确保统一格式
    let normalized = url.startsWith('/') ? url.slice(1) : url;

    // 移除末尾的斜杠
    normalized = normalized.replace(/\/$/, '');

    // 如果不是页面路由，添加 /page 后缀
    if (!normalized.endsWith('/page') && !normalized.includes('/modal/')) {
      normalized += '/page';
    }

    return normalized;
  }
}