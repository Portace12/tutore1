import { defineStore } from "pinia";
import { getLocalStorageItem } from "../../helpers";
import { createStudentService, deleteStudentService, getAllStudentsService, updateStudentService } from "@/services/studentService";

const useStudentStore = defineStore("student", {
  state: () => ({
    students: getLocalStorageItem('students') ? getLocalStorageItem('students') : [],
    error: null,
    loading: false,
  }),
  actions: {
    async fetchAllStudents() {
      this.loading = true;
      this.error = null;
      try {
        const data = await getAllStudentsService();
        this.students = data;
      } catch (error) {
        console.error("Error fetching students:", error);
        this.error = error.message || "Failed to fetch students";
      } finally {
        this.loading = false;
      }
    },
    async createStudent(studentData) {
      this.loading = true;
      this.error = null

      try {
        await createStudentService(studentData);
        this.fetchAllStudents();
      } catch (error) {
        console.error("Error creating student:", error);
        this.error = error.message || "Failed to create student";
      } finally {
        this.loading = false;
      }
    },
    async updateStudent(id, studentData) {
      this.loading = true;
      this.error = null;
      try {
        await updateStudentService(id, studentData);
        this.fetchAllStudents();
      } catch (error) {
        console.error("Error updating student:", error);
        this.error = error.message || "Failed to update student";
      } finally {
        this.loading = false;
      }
    },
    async deleteStudent(id){
      this.loading = true;
      this.error = null;
      try {
        await deleteStudentService(id);
        this.fetchAllStudents()
      } catch (error) {
        console.error("Error deleting student:", error);
        this.error = error.message || "Failed to delete student";
      } finally {
        this.loading = false;
      }
    }
  },
});

export default useStudentStore;
