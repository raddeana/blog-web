/**
 * 用户域业务编排层
 * - 当前仅透传 apis，作为多步骤/带缓存复合操作的扩展点
 * - 不在 index.ts 中导出，作为包内部实现细节
 *   未来如需 loginAndCache / registerAndAutoLogin 等复合逻辑，放此文件
 */
import {
  login,
  register,
  modifyPassword,
  type LoginParams,
  type RegisterParams,
  type ModifyPasswordParams,
  type ApiResponse,
  type LoginResult,
} from '../apis/user';

export const userService = {
  login: (params: LoginParams) => login(params) as Promise<ApiResponse<LoginResult>>,
  register,
  modifyPassword,
};

export type { LoginParams, RegisterParams, ModifyPasswordParams } from '../apis/user';
