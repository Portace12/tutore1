import { createCourseService, deleteCourseService, getAllCoursesService, getAssociations, updateCourseService } from "@/services/courseService";
import { getLocalStorageItem } from "../../helpers";
import { defineStore } from "pinia";

export const useCourseStore = defineStore("course", {
  state: () => ({
    courses: getLocalStorageItem("courses")
      ? getLocalStorageItem("courses")
      : [],
    associations: getLocalStorageItem('associations') ? getLocalStorageItem('associations') : [],
    loading: false,
    error: null
  }),
  actions: {
    async fetchAllCourses() {
      this.loading = true;
      this.error = null;
      try {
        const data = await getAllCoursesService();
        this.courses = data;
      } catch (error) {
        this.error = error.message || "An error occurred";
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    async fetchAssociations() {
      this.loading = true;
      this.error = null;
      try {
        const data = await getAssociations();
        this.associations = data;
      } catch (error) {
        this.error = error.message || "An error occurred";
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    async createCourse(data) {
      this.loading = true;
      this.error = null;
      try {
        await createCourseService(data);
        this.fetchAllCourses();
        this.fetchAssociations()
      } catch (error) {
        this.error = error.message || "An error occurred";
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    async deleteCourse(id) {
      this.loading = true;
      this.error = null;
      try {
        await deleteCourseService(id);
        this.fetchAllCourses();
        this.fetchAssociations()
      } catch (error) {
        this.error = error.message || "An error occurred";
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    async updateCourse(data) {
      this.loading = true;
      this.error = null;
      try {
        await updateCourseService(data);
        this.fetchAllCourses();
        this.fetchAssociations()
      } catch (error) {
        this.error = error.message || "An error occurred";
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
  },
});
