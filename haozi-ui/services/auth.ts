import { request } from '@/lib/api';
import { LoginParams, LoginResponse, UserInfo } from '@/lib/auth';
import { withErrorHandling } from '@/lib/apiUtils';
import { API } from '@/lib/apiEndpoints';

// 登录
export const login = (params: LoginParams) => {
  return withErrorHandling(
    request.post<LoginResponse>(API.auth.login(), params),
    '登录'
  );
};

// 登出
export const logout = () => {
  return withErrorHandling(
    request.post(API.auth.logout()),
    '登出'
  );
};

// 获取用户信息
export const getUserInfo = () => {
  return withErrorHandling(
    request.get<UserInfo>(API.auth.userInfo()),
    '获取用户信息'
  );
};

// 刷新token
export const refreshToken = () => {
  return withErrorHandling(
    request.post<{ token: string }>(API.auth.refreshToken()),
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
    request.post(API.auth.changePassword(), params),
    '修改密码'
  );
};

// 发送验证码
export const sendCaptcha = (phone: string) => {
  return withErrorHandling(
    request.post(API.auth.sendCaptcha(), { phone }),
    '发送验证码'
  );
};

// 验证码登录
export const loginByCaptcha = (params: {
  phone: string;
  captcha: string;
}) => {
  return withErrorHandling(
    request.post<LoginResponse>(API.auth.loginByCaptcha(), params),
    '验证码登录'
  );
};