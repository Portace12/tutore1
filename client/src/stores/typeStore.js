import { createTypeService, deleteTypeService, getAllTypesService, getAssociationsType, loadCreateTypeService, updateTypeService } from "@/services/typeService";
import { getLocalStorageItem } from "../../helpers";
import { defineStore } from "pinia";

export const useTypeStore = defineStore("Type", {
  state: () => ({
    types: getLocalStorageItem("types")
      ? getLocalStorageItem("types")
      : [],
    associationTypes: getLocalStorageItem('associationTypes') ? getLocalStorageItem('associationTypes') : [],
    loading: false,
    error: null
  }),
  actions: {
    async fetchAllTypes() {
      this.loading = true;
      this.error = null;
      try {
        const data = await getAllTypesService();
        this.types = data;
      } catch (error) {
        this.error = error.message || "An error occurred";
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    async fetchAssociationTypes() {
      this.loading = true;
      this.error = null;
      try {
        const data = await getAssociationsType();
        this.associationTypes = data;
      } catch (error) {
        this.error = error.message || "An error occurred";
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    async createType(data) {
      this.loading = true;
      this.error = null;
      try {
        await createTypeService(data);
        this.fetchAllTypes();
        this.fetchAssociationTypes()
      } catch (error) {
        this.error = error.message || "An error occurred";
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    async createMultiple(data) {
      this.loading = true;
      this.error = null;
      try {
        await loadCreateTypeService(data);
        this.fetchAllTypes();
        this.fetchAssociationTypes()
      } catch (error) {
        this.error = error.message || "An error occurred";
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    async deleteType(id) {
      this.loading = true;
      this.error = null;
      try {
        await deleteTypeService(id);
        this.fetchAllTypes();
        this.fetchAssociationTypes()
      } catch (error) {
        this.error = error.message || "An error occurred";
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    async updateType(data) {
      this.loading = true;
      this.error = null;
      try {
        await updateTypeService(data);
        this.fetchAllTypes();
        this.fetchAssociationTypes()
      } catch (error) {
        this.error = error.message || "An error occurred";
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
  },
});
