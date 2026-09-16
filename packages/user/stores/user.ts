import { defineStore } from 'pinia';
import {
  login as apiLogin,
  register as apiRegister,
  modifyPassword as apiModifyPassword,
  type UserInfo,
  type LoginParams,
  type RegisterParams,
  type ModifyPasswordParams,
} from '../apis/user';

/**
 * localStorage keys
 */
const TOKEN_KEY = 'blog_user_token';
const USER_KEY = 'blog_user_info';

function loadToken(): string {
  if (typeof window === 'undefined') return '';
  return window.localStorage.getItem(TOKEN_KEY) || '';
}

function loadUserInfo(): UserInfo | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserInfo;
  } catch {
    return null;
  }
}

function saveToken(token: string) {
  if (typeof window === 'undefined') return;
  if (token) {
    window.localStorage.setItem(TOKEN_KEY, token);
  } else {
    window.localStorage.removeItem(TOKEN_KEY);
  }
}

function saveUserInfo(info: UserInfo | null) {
  if (typeof window === 'undefined') return;
  if (info) {
    window.localStorage.setItem(USER_KEY, JSON.stringify(info));
  } else {
    window.localStorage.removeItem(USER_KEY);
  }
}

interface UserState {
  token: string;
  userInfo: UserInfo | null;
}

export const useUserStore = defineStore('blog-user', {
  state: (): UserState => ({
    token: loadToken(),
    userInfo: loadUserInfo(),
  }),
  getters: {
    isLogin: (state) => !!state.token,
  },
  actions: {
    setToken(token: string) {
      this.token = token;
      saveToken(token);
    },
    setUserInfo(info: UserInfo | null) {
      this.userInfo = info;
      saveUserInfo(info);
    },
    async login(params: LoginParams) {
      const res = await apiLogin(params);
      if (res.code !== 0) {
        throw new Error(res.message);
      }
      this.setToken(res.data.token);
      this.setUserInfo(res.data.userInfo);
      return res.data;
    },
    async register(params: RegisterParams) {
      const res = await apiRegister(params);
      if (res.code !== 0) {
        throw new Error(res.message);
      }
      return res.data;
    },
    async modifyPassword(params: ModifyPasswordParams) {
      const res = await apiModifyPassword(params);
      if (res.code !== 0) {
        throw new Error(res.message);
      }
      return res.data;
    },
    logout() {
      this.setToken('');
      this.setUserInfo(null);
    },
  },
});

export default useUserStore;
