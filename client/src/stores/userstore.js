import { defineStore } from 'pinia';
import { getLocalStorageItem } from '../../helpers';
import { getAllUserService } from '@/services/userService';

const useUserStore = defineStore("userStore", {
  state: () => ({
    users: getLocalStorageItem("users") || []
  }),
  actions: {
    async fetchUsers() {
      this.users = await getAllUserService();
    }
  }
});

export default useUserStore;
