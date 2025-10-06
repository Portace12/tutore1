// Fichier : ../Controller/resultatController.js

import { saveResultatModel, getResultatsByEtudiantModel, getResultats } from "../Models/resultatModel.js"; 
import { db } from "../server.js";

export const saveResultatController = async (req, res) => {
    const connection = await db.getConnection();
    try {
        const data = req.body; 

        // ATTENTION : Correction de la condition de validation
        if (
            !data.id_etudiant || 
            !data.note_finale_600 || 
            !data.pourcentage_final || 
            !data.historique_complet ||
            data.validation_globale === undefined || // VÉRIFIER L'EXISTENCE
            data.credits_valides === undefined      // VÉRIFIER L'EXISTENCE
        ) {
            return res.status(400).json({ message: "Data required." });
        }
        
        const result = await saveResultatModel(connection, data);
        res.status(200).json({ 
            message: `Global result ${result.updated ? 'updated' : 'save'} successfulyy.`,
            data: result
        });
    } catch (error) {
        console.error("Error to save result:", error);
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
};

// Le reste du contrôleur est fonctionnel et n'a pas été modifié.

export const getResultatsByEtudiantController = async (req, res) => {
    const connection = await db.getConnection();
    const { id_etudiant } = req.params;
    try {
        const resultat = await getResultatsByEtudiantModel(connection, id_etudiant); 
        
        if (!resultat) {
            return res.status(404).json({ message: "Result not found for this student." });
        }
        
        // Assurez-vous que le champ JSON est parsé avant d'être envoyé au front-end
        if (typeof resultat.historique_complet === 'string') {
             resultat.historique_complet = JSON.parse(resultat.historique_complet);
        }

        res.status(200).json(resultat);
    } catch (error) {
        console.error("Error to fetch results:", error);
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
};

export const getResultatsController = async (req, res)=>{
    const connection = await db.getConnection();
    try {
        const results = await getResultats(connection)
        res.status(200).json(results)
    } catch (error) {
        res.status(500).json({ error: error.message })
    } finally {
        connection.release()
    }
}