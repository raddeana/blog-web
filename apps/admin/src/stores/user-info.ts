import { defineStore } from 'pinia';

export const useCounterStore = defineStore('userInfo', {
  state: () => {
    return {
      token: '',
      userInfo: {},
    };
  },
  actions: {
    /**
     * 更新token
     */
    updateToken (token: string) {
      this.token = token;
    },
    /**
     * 更新用户信息
     */
    updateUserInfo (userInfo: object) {
      this.userInfo  = userInfo;
    },
  },
});