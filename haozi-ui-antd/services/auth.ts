import { request, ApiResponse } from '@/lib/api';
import { LoginParams, LoginResponse, UserInfo } from '@/lib/auth';
import { withErrorHandling } from '@/lib/apiUtils';

// 登录
export const login = (params: LoginParams) => {
  return withErrorHandling(
    request.post<LoginResponse>('/sys/auth/login', params),
    '登录'
  );
};

// 登出
export const logout = () => {
  return withErrorHandling(
    request.post('/sys/auth/logout'),
    '登出'
  );
};

// 获取用户信息
export const getUserInfo = () => {
  return withErrorHandling(
    request.get<UserInfo>('/sys/auth/user-info'),
    '获取用户信息'
  );
};

// 刷新token
export const refreshToken = () => {
  return withErrorHandling(
    request.post<{ token: string }>('/sys/auth/refresh-token'),
    '刷新token'
  );
};

// 修改密码
export const changePassword = (params: {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}) => {
  return withErrorHandling(
    request.post('/sys/auth/change-password', params),
    '修改密码'
  );
};

// 发送验证码
export const sendCaptcha = (phone: string) => {
  return withErrorHandling(
    request.post('/sys/auth/send-captcha', { phone }),
    '发送验证码'
  );
};

// 验证码登录
export const loginByCaptcha = (params: {
  phone: string;
  captcha: string;
}) => {
  return withErrorHandling(
    request.post<LoginResponse>('/sys/auth/login-by-captcha', params),
    '验证码登录'
  );
};