
import { createDepartementService, deleteDepartementService, getDepartementService, updateDepartementService } from "@/services/departementService";
import { defineStore } from "pinia";
import { getLocalStorageItem } from "../../helpers";

const useDepartementStore = defineStore("departement", {
  state: () => ({
    departements: getLocalStorageItem("departements") ? getLocalStorageItem("departements") : [],
    loading: null,
    error: null
  }),
  actions: {
    async fetchDepartements() {
      this.loading = true;
      this.error = null;
      try {
        const data = await getDepartementService();
        this.departements = data;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async createDepartement(datas) {
      this.loading = true;
      this.error = null;
      try {
        await createDepartementService(datas);
        await this.fetchDepartements();
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async updateDepartement(datas) {
      this.loading = true
      this.error = null
      try {
        await updateDepartementService(datas)
        this.fetchDepartements()
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    async deleteDepartement(id) {
      this.loading = true
      this.error = null
      try {
        await deleteDepartementService(id)
        await this.fetchDepartements()
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    }
  },
});

export default useDepartementStore;
