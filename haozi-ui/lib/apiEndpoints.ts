/**
 * API 接口端点集中管理
 * 统一管理所有后端API接口的URL路径
 */

/**
 * API 端点配置接口
 */
interface ApiEndpointConfig {
    /** 基础路径 */
    baseURL: string;
    /** 接口超时时间 */
    timeout: number;
}

/**
 * 各模块接口端点定义（内部使用）
 */
const API_ENDPOINTS = {
    // 认证模块
    AUTH: {
        LOGIN: '/sys/auth/login',
        LOGOUT: '/sys/auth/logout',
        USER_INFO: '/sys/auth/user-info',
        REFRESH_TOKEN: '/sys/auth/refresh-token',
        CHANGE_PASSWORD: '/sys/auth/change-password',
        SEND_CAPTCHA: '/sys/auth/send-captcha',
        LOGIN_BY_CAPTCHA: '/sys/auth/login-by-captcha',
    },

    // 菜单模块
    MENU: {
        LIST: '/sys/menu/list',
        DETAIL: (id: string) => `/sys/menu/${id}`,
        CREATE: '/sys/menu',
        UPDATE: '/sys/menu',
        DELETE: (id:string)=>`/sys/menu/${id}`,
        NAVIGATION: {
            LIST: '/sys/menu/nav',
            AUTHORITY: '/sys/menu/authority',
        },
    },

    // 用户模块
    USER: {
        PAGE: '/sys/user/page',
        LIST: '/sys/user/list',
        DETAIL: (id: string) => `/sys/user/${id}`,
        CREATE: '/sys/user',
        UPDATE: '/sys/user',
        DELETE: (id:string)=>`/sys/user/${id}`,
        PROFILE: '/sys/user/profile',
        INFO: '/sys/user/info',
        RESET_PASSWORD: (id: string) => `/sys/user/${id}/resetPassword`,
        CHANGE_STATUS: (id: string) => `/sys/user/${id}/status`,
    },

    // 角色模块
    ROLE: {
        PAGE: '/sys/role/page',
        LIST: '/sys/role/list',
        DETAIL: (id: string) => `/sys/role/${id}`,
        CREATE: '/sys/role',
        UPDATE: '/sys/role',
        DELETE: (id:string)=>`/sys/role/${id}`,
        MENU: '/sys/role/menu',
    },
} as const;


/**
 * API 端点类型定义（内部使用）
 */
type ApiEndpointType = typeof API_ENDPOINTS;


/**
 * API 配置
 */
export const API_CONFIG: ApiEndpointConfig = {
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
    timeout: 30000,
};


/**
 * 常用接口快捷获取方法
 */
export const API = {
    // 认证相关
    auth: {
        login: () => API_ENDPOINTS.AUTH.LOGIN,
        logout: () => API_ENDPOINTS.AUTH.LOGOUT,
        userInfo: () => API_ENDPOINTS.AUTH.USER_INFO,
        refreshToken: () => API_ENDPOINTS.AUTH.REFRESH_TOKEN,
        changePassword: () => API_ENDPOINTS.AUTH.CHANGE_PASSWORD,
        sendCaptcha: () => API_ENDPOINTS.AUTH.SEND_CAPTCHA,
        loginByCaptcha: () => API_ENDPOINTS.AUTH.LOGIN_BY_CAPTCHA,
    },

    // 菜单相关
    menu: {
        list: () => API_ENDPOINTS.MENU.LIST,
        detail: (id: string) => API_ENDPOINTS.MENU.DETAIL(id),
        create: () => API_ENDPOINTS.MENU.CREATE,
        update: () => API_ENDPOINTS.MENU.UPDATE,
        delete: (id:string) => API_ENDPOINTS.MENU.DELETE(id),
        navigation: {
            list: () => API_ENDPOINTS.MENU.NAVIGATION.LIST,
            authority: () => API_ENDPOINTS.MENU.NAVIGATION.AUTHORITY,
        },
    },
    // 用户相关
    user: {
        page: () => API_ENDPOINTS.USER.PAGE,
        list: () => API_ENDPOINTS.USER.LIST,
        detail: (id: string) => API_ENDPOINTS.USER.DETAIL(id),
        create: () => API_ENDPOINTS.USER.CREATE,
        update: () => API_ENDPOINTS.USER.UPDATE,
        delete: (id:string) => API_ENDPOINTS.USER.DELETE(id),
        resetPassword: (id: string) => API_ENDPOINTS.USER.RESET_PASSWORD(id),
        changeStatus: (id: string) => API_ENDPOINTS.USER.CHANGE_STATUS(id),
        profile: () => API_ENDPOINTS.USER.PROFILE,
        info: () => API_ENDPOINTS.USER.INFO,
    },
    // 角色相关
    role: {
        page: () => API_ENDPOINTS.ROLE.PAGE,
        list: () => API_ENDPOINTS.ROLE.LIST,
        detail: (id: string) => API_ENDPOINTS.ROLE.DETAIL(id),
        create: () => API_ENDPOINTS.ROLE.CREATE,
        update: () => API_ENDPOINTS.ROLE.UPDATE,
        delete: (id:string) => API_ENDPOINTS.ROLE.DELETE(id),
        menu: () => API_ENDPOINTS.ROLE.MENU,
    }
} as const;

