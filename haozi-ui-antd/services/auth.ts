import { request, ApiResponse } from '@/lib/api';
import { LoginParams, LoginResponse, UserInfo } from '@/lib/auth';

// 登录
export const login = (params: LoginParams) => {
  return request.post<LoginResponse>('/sys/auth/login', params);
};

// 登出
export const logout = () => {
  return request.post('/sys/auth/logout');
};

// 获取用户信息
export const getUserInfo = () => {
  return request.get<UserInfo>('/sys/auth/user-info');
};

// 刷新token
export const refreshToken = () => {
  return request.post<{ token: string }>('/sys/auth/refresh-token');
};

// 修改密码
export const changePassword = (params: {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}) => {
  return request.post('/sys/auth/change-password', params);
};

// 发送验证码
export const sendCaptcha = (phone: string) => {
  return request.post('/sys/auth/send-captcha', { phone });
};

// 验证码登录
export const loginByCaptcha = (params: {
  phone: string;
  captcha: string;
}) => {
  return request.post<LoginResponse>('/sys/auth/login-by-captcha', params);
};