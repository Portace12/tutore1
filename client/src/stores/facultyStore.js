import { createFacultyService, deleteFacultyService, getAllFacultiesService, getFacultyById, updateFacultyService } from "@/services/facultyService";
import { getLocalStorageItem } from "../../helpers";
import { defineStore } from "pinia";

export const useFacultyStore = defineStore("faculty", {
  state: () => ({
    faculties: getLocalStorageItem("faculties")
      ? getLocalStorageItem("faculties")
      : [],
    faculty: getLocalStorageItem("faculty") ? getLocalStorageItem("faculty") : null,
    loading: false,
    error: null
  }),
  actions: {
    async fetchAll() {
      this.loading = true;
      this.error = null;
      try {
        const data = await getAllFacultiesService();
        this.faculties = data;
      } catch (error) {
        this.error = error.message || "An error occurred";
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    async createFaculty(data) {
      this.loading = true;
      this.error = null;
      try {
        await createFacultyService(data);
        this.fetchAll();
      } catch (error) {
        this.error = error.message || "An error occurred";
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    async deleteFaculty(id){
      this.loading = true;
      this.error = null;
      try {
        await deleteFacultyService(id);
        this.fetchAll();
      } catch (error) {
        this.error = error.message || "An error occurred";
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    async getOne(id){
      this.loading = true;
      this.error = null;
      try {
        const data = await getFacultyById(id);
        this.faculty = data;
      } catch (error) {
        this.error = error.message || "An error occurred";
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    async updateFaculty(data) {
      this.loading = true;
      this.error = null;
      try {
        await updateFacultyService(data);
        this.fetchAll();
      } catch (error) {
        this.error = error.message || "An error occurred";
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
  },
});
