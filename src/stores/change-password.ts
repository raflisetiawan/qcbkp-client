import { defineStore } from 'pinia';

export const useChangePasswordStore = defineStore('change-password', {
  state: () => ({
    changePasswordDialog: false,
  }),
});
