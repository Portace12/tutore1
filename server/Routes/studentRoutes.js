import express from 'express'
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { deleteStudentController, getAllStudentController, getStudentByIdController, registerStudent, updateStudentController } from '../Controller/studentController.js';
const router = express.Router()

// Configuration de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const photoDir = path.join(process.cwd(), 'uploads', 'students');
        if (!fs.existsSync(photoDir)) {
            fs.mkdirSync(photoDir, { recursive: true });
        }
        cb(null, photoDir);
    },
    filename: (req, file, cb) => {
        // Sauvegarde avec un nom unique (timestamp + nom original)
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

// Route POST pour l'enregistrement d'un nouveau professeur (avec image)
router.post('/create', upload.single('photo'), registerStudent);

// Route GET pour récupérer tous les professeurs
router.get('/get', getAllStudentController);

// Route GET pour récupérer un professeur par son ID
router.get('/get/:id', getStudentByIdController);

// --- La mise à jour est ici ---
// Route PUT pour la mise à jour d'un professeur
// Elle utilise aussi le middleware 'upload.single('photo')'
router.put('/update/:id', upload.single('photo'), updateStudentController);

// Route DELETE pour supprimer un professeur
router.delete('/delete/:id', deleteStudentController);

export default router;