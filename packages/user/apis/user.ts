import axios from 'axios';

/**
 * 统一响应结构
 */
export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
}

/**
 * 用户信息
 */
export interface UserInfo {
  id: string;
  username: string;
  email: string;
}

/**
 * 登录入参
 */
export interface LoginParams {
  username: string;
  password: string;
}

/**
 * 登录返回
 */
export interface LoginResult {
  token: string;
  userInfo: UserInfo;
}

/**
 * 注册入参
 */
export interface RegisterParams {
  username: string;
  email: string;
  password: string;
}

/**
 * 修改密码入参
 */
export interface ModifyPasswordParams {
  oldPassword: string;
  newPassword: string;
}

/**
 * axios 实例
 * - baseURL 通过宿主 .env 的 VITE_API_BASE_URL 覆盖，默认 /api
 * - 当前为 mock 阶段，请求拦截器仅做归一化，不注入 token
 *   避免与 store 形成循环依赖；token 注入留待接入真实后端时实现
 */
const request = axios.create({
  baseURL: (import.meta as any).env?.VITE_API_BASE_URL || '/api',
  timeout: 10000,
});

request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error?.response?.data?.message || error?.message || '网络异常';
    return Promise.reject({ code: error?.response?.status || -1, message, data: null });
  },
);

/**
 * mock 延迟
 */
const MOCK_DELAY = 600;
function mockResponse<T>(data: T, code = 0, message = 'ok'): Promise<ApiResponse<T>> {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ code, message, data }), MOCK_DELAY);
  });
}

/**
 * 登录
 */
export async function login(params: LoginParams): Promise<ApiResponse<LoginResult>> {
  // 真实后端：return request.post('/user/login', params);
  const data: LoginResult = {
    token: 'mock-token-' + Date.now(),
    userInfo: {
      id: 'mock-' + params.username,
      username: params.username,
      email: params.username.includes('@') ? params.username : `${params.username}@blog.dev`,
    },
  };
  return mockResponse(data);
}

/**
 * 注册
 */
export async function register(params: RegisterParams): Promise<ApiResponse<{ userId: string }>> {
  // 真实后端：return request.post('/user/register', params);
  return mockResponse({ userId: 'mock-' + params.username });
}

/**
 * 修改密码
 */
export async function modifyPassword(
  params: ModifyPasswordParams,
): Promise<ApiResponse<null>> {
  // 真实后端：return request.post('/user/modify-password', params);
  void params; // mock 阶段未使用，保留签名以对齐真实后端
  return mockResponse(null);
}

export default request;
