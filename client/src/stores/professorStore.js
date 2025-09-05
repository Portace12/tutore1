import { createProfessorService, deleteProfessorService, getAllProfessorsService, updateProfessorService } from "@/services/professorService";
import { defineStore } from "pinia";
import { getLocalStorageItem } from "../../helpers";

const useProfessorStore = defineStore("professor", {
  state: () => ({
    professors: getLocalStorageItem('professors') ? getLocalStorageItem('professors') : [],
    error: null,
    loading: false,
  }),
  actions: {
    async fetchAll() {
      this.loading = true;
      this.error = null;
      try {
        const data = await getAllProfessorsService();
        this.professors = data;
      } catch (error) {
        console.error("Error fetching professors:", error);
        this.error = error.message || "Failed to fetch professors";
      } finally {
        this.loading = false;
      }
    },
    async createProfessor(professorData) {
      this.loading = true;
      this.error = null
      try {
        await createProfessorService(professorData);
        this.fetchAll();
      } catch (error) {
        console.error("Error creating professor:", error);
        this.error = error.message || "Failed to create professor";
      } finally {
        this.loading = false;
      }
    },
    async updateProfessor(id, professorData) {
      this.loading = true;
      this.error = null;
      try {
        await updateProfessorService(id, professorData);
        this.fetchAll();
      } catch (error) {
        console.error("Error updating professor:", error);
        this.error = error.message || "Failed to update professor";
      } finally {
        this.loading = false;
      }
    },
    async deleteProfessor(id){
      this.loading = true;
      this.error = null;
      try {
        await deleteProfessorService(id);
        this.fetchAll()
      } catch (error) {
        console.error("Error deleting professor:", error);
        this.error = error.message || "Failed to delete professor";
      } finally {
        this.loading = false;
      }
    }
  },
});

export default useProfessorStore;
