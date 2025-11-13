import { request } from '@/lib/api';
import { LoginParams } from '@/lib/auth';
import { withErrorHandling } from '@/lib/apiUtils';
import { API } from '@/lib/apiEndpoints';


// 登出
export const logout = () => {
  return withErrorHandling(
    request.post(API.auth.logout()),
    '登出'
  );
};

