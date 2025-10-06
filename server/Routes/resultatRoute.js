// Fichier : ../Route/resultatRoute.js (Ancien nom: resultatRoute.js)

import express from "express";
import { saveResultatController, getResultatsByEtudiantController, getResultatsController } from "../Controller/resultatController.js";

const router = express.Router();

// Route POST pour l'enregistrement/mise à jour unique (ancien /save)
router.post("/save", saveResultatController); 

// Route GET pour la récupération unique (ancien /etudiant/:id_etudiant)
router.get("/etudiant/:id_etudiant", getResultatsByEtudiantController); 

router.get("/get", getResultatsController); 

export default router;