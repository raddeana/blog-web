import { defineStore } from 'pinia';

export const useCounterStore = defineStore('userInfo', {
  state: () => {
    return {
        token: '',
        name: '',
        avatar: '',
    };
  },
  actions: {
    updateToken (token: string) {
      this.token = token;
    },
    updateName (name: string) {
      this.name = name;
    },
    updateAvatar (avatar: string) {
      this.avatar  = avatar;
    },
  },
});