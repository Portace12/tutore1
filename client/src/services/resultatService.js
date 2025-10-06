// Fichier : /src/services/resultatService.js (Ancien nom: resultatService.js)

import { successNotification, errorNotification, setLocalStorageItem } from "../../helpers";

// La fonction saveResultat est désormais utilisée pour l'enregistrement GLOBAL
export const saveResultatService = async (data) => {
  try {
    const response = await fetch("http://localhost:4000/api/resultats/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Les données sont le payload unique calculé dans le composant
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Erreur lors de l'enregistrement global");
    successNotification(result.message);
    return result;
  } catch (error) {
    errorNotification(error.message || "Une erreur est survenue lors de la sauvegarde globale");
    throw error;
  }
};

// La fonction getResultatsByEtudiantService est désormais utilisée pour la récupération GLOBALE
export const getResultatsByEtudiantService = async (id_etudiant) => {
  try {
    const response = await fetch(`http://localhost:4000/api/resultats/etudiant/${id_etudiant}`);

    // Si 404 (pas de résultat trouvé), on retourne null au lieu de lever une erreur
    if (response.status === 404) return null;

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Erreur lors de la récupération globale");
    return result;
  } catch (error) {
    errorNotification(error.message || "Une erreur est survenue lors de la récupération globale");
    throw error;
  }
};

export const getAllResult = async () => {
  try {
    const response = await fetch(`http://localhost:4000/api/resultats/get`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Fail to fetch results");
    }

    const resultsWithParsedHistory = data.map(resultat => {
      let historiqueParsed = null;

      if (resultat.historique_complet && typeof resultat.historique_complet === 'string') {
        try {
          historiqueParsed = JSON.parse(resultat.historique_complet);
        } catch (e) {
          console.error(`Erreur de parsing de l'historique pour le résultat ID: ${resultat.id}`, e);

          historiqueParsed = [];
        }
      } else {
        historiqueParsed = resultat.historique_complet;
      }
      return {
        ...resultat,
        historique_complet: historiqueParsed
      };
    });

    setLocalStorageItem('results', resultsWithParsedHistory);

    return resultsWithParsedHistory;
  } catch (error) {
    errorNotification(error.message || "An error occurred");
    throw error;
  }
}
