/**
 * 授权资源
 */
export type AuthorizationPayload = {
    routeCodes: string[];
    permissions: string[];
};

/**
 * 当前用户
 */
export type CurrentUser = AuthorizationPayload & {
    id: number;
    username: string;
    realName?: string | null;
    avatar?: string | null;
    roles: string[];
};

/**
 * 登录请求
 */
export type LoginRequest = {
    username: string;
    password: string;
};

/**
 * 登录结果（后端 LoginResultVO 对应）
 */
export type LoginResult = {
    token: string;
    user: CurrentUser;
};
