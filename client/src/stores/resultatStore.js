// Fichier : /src/stores/resultatStore.js (Ancien nom: useResultatStore.js)

import { defineStore } from "pinia";
import { saveResultatService, getResultatsByEtudiantService, getAllResult } from "@/services/resultatService";
import { getLocalStorageItem } from "../../helpers";

export const useResultatStore = defineStore("resultat", {
  state: () => ({
    // L'état stocke l'objet unique du résultat global de l'étudiant consulté
    resultat: getLocalStorageItem("results")
      ? getLocalStorageItem("results")
      : [],
    loading: false,
    error: null
  }),
  actions: {
    async fetchAllResult() {
      this.loading = true;
      this.error = null;
      try {
        const data = await getAllResult();
        this.resultat = data;
      } catch (error) {
        this.error = error.message || "An error occurred";
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    // saveResultat prend maintenant le payload global unique
    async saveResultat(data) {
      this.loading = true;
      this.error = null;
      try {
        // Appel au service unique
        await saveResultatService(data);
        this.fetchAllResult()
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },
    // fetchResultatsByEtudiant récupère l'objet global unique
    async fetchResultatsByEtudiant(id_etudiant) {
      this.loading = true;
      this.error = null;
      try {
        // Appel au service unique (retourne l'objet ou null)
        const data = await getResultatsByEtudiantService(id_etudiant);
        this.resultat = data;
        return data; // Retourne les données pour le composant
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});
