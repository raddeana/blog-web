import { defineStore } from 'pinia';

export const useCounterStore = defineStore('userInfo', {
  state: () => {
    return {
        token: null,
        name: null,
        avatar: null,
    };
  },
  actions: {
    increment () {
      this.count ++;
    },
  },
});