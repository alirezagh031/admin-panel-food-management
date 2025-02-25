import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: null,
    refreshToken: null,
  }),
  actions: {
    setTokens(access, refresh) {
      this.accessToken = access;
      this.refreshToken = refresh;
    },
    clearTokens() {
      this.accessToken = null;
      this.refreshToken = null;
    }
  },
  persist: true, // اضافه کردن ذخیره دائمی
});
