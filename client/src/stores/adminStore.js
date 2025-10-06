// stores/adminStore.js
import { defineStore } from "pinia";
import { getLocalStorageItem } from "../../helpers";
import { createAdminService, getAllAdminsService, updateAdminService, deleteAdminService } from "@/services/adminService";

const useAdminStore = defineStore("admin", {
  state: () => ({
    admins: getLocalStorageItem("admins") || [],
    error: null,
    loading: false,
  }),
  actions: {
    async fetchAllAdmins() {
      this.loading = true;
      try {
        const data = await getAllAdminsService();
        this.admins = data;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async createAdmin(adminData) {
      this.loading = true;
      try {
        await createAdminService(adminData);
        await this.fetchAllAdmins();
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async updateAdmin(id, adminData) {
      this.loading = true;
      try {
        await updateAdminService(id, adminData);
        await this.fetchAllAdmins();
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async deleteAdmin(id) {
      this.loading = true;
      try {
        await deleteAdminService(id);
        await this.fetchAllAdmins();
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});

export default useAdminStore;
