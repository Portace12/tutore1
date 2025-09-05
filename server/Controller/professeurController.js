import { createUser, deleteUserModel, findSUer, updateUser } from '../Models/userModel.js';
import { createProfessor, deleteProfessorModel, getAllProfessorModel, getProfessorByIdModel, updateProfessorModel } from "../Models/professorModel.js";
import { db } from '../server.js'; // Importation du pool de connexions
import path from 'path';
export const registerProfessor = async (req, res) => {
    const { nom, anniv, adress, numero, genre, grade, email, matricule, role } = req.body;

    // Le chemin d'accès complet du fichier est dans req.file.path
    const fullPhotoPath = req.file ? req.file.path : null;

    if (!nom || !anniv || !adress || !numero || !genre || !grade || !email || !matricule || !role || !fullPhotoPath) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Extrayez le chemin d'accès relatif que vous enregistrerez dans la base de données.
    // Il doit commencer par 'uploads/professors' ou une structure similaire.
    // L'utilisation de `path.basename` est utile pour cela.
    const photo_url = path.join('uploads', 'professors', path.basename(fullPhotoPath));

    const userData = { email, matricule, role };
    const connection = await db.getConnection();

    const user = await findSUer(connection, email);
    if (user) {
        connection.release();
        return res.status(400).json({ message: "User already exists" });
    }
    
    try {
        await connection.beginTransaction();

        const userId = await createUser(connection, userData);

        await createProfessor(connection, userId, {
            nom, anniv, adress, numero, genre, grade, photo_url
        });

        await connection.commit();
        res.status(201).json({ message: "Professor registered successfully." });

    } catch (error) {
        await connection.rollback();
        console.error("Error during registration:", error);
        res.status(500).json({ message: "Internal server error during registration." });

    } finally {
        connection.release();
    }
};

export const getAllProfessorController = async (req, res) => {
    const connection = await db.getConnection();
    try {
        const professors = await getAllProfessorModel(connection);
        return res.status(200).json(professors);
    } catch (error) {
        console.error("Error fetching professors:", error);
        res.status(500).json({ message: "Internal server error fetching professors." });

    } finally {
        connection.release();
    }
}

export const getProfessorByIdController = async (req, res) => {
    const connection = await db.getConnection();
    try {
        let { id } = req.params
        id = parseInt(id)
        const professor = await getProfessorByIdModel(connection, id)
        res.status(200).json(professor)
    } catch (error) {
        console.error("Error fetching professor:", error);
        res.status(500).json({ message: "Internal server error fetching professor." });

    } finally {
        connection.release();
    }
}

export const updateProfessorController = async (req, res) => {
    const { nom, anniv, adress, numero, genre, grade, email, matricule, role } = req.body;
    let { id } = req.params;
    id = parseInt(id);

    // Initialisez la variable de l'URL de la photo mise à jour
    let updatedPhotoUrl = null;

    // Si un nouveau fichier est uploadé, utilisez son chemin d'accès
    if (req.file) {
        // Créez le chemin relatif pour la base de données
        const relativePath = path.join('uploads', 'professors', path.basename(req.file.path));
        updatedPhotoUrl = relativePath;
    } else if (req.body.photo) { // Utilisez 'photo' ici, pas 'photo_url'
        // Si la photo n'a pas été changée, le front-end envoie l'URL existante
        updatedPhotoUrl = req.body.photo;
    }

    if (!id || !nom || !anniv || !adress || !numero || !genre || !grade || !email || !matricule || !role) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const userData = { email, matricule, role };
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        await updateUser(connection, id, userData);

        const professorData = { nom, anniv, adress, numero, genre, grade };
        if (updatedPhotoUrl) {
            professorData.photo_url = updatedPhotoUrl;
        }

        await updateProfessorModel(connection, id, professorData);
        await connection.commit();
        res.status(200).json({ message: "Professor updated successfully." });

    } catch (error) {
        await connection.rollback();
        console.error("Error during update:", error);
        res.status(500).json({ message: "Internal server error during update." });
    } finally {
        connection.release();
    }
};

export const deleteProfessorController = async (req, res) => {
    let { id } = req.params;
    id = parseInt(id);
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        // await deleteProfessorModel(connection, id);
        await deleteUserModel(connection, id);
        await connection.commit();
        res.status(200).json({ message: "Professor deleted successfully." });
    } catch (error) {
        await connection.rollback();
        console.error("Error during deletion:", error);
        res.status(500).json({ message: "Internal server error during deletion." });
    } finally {
        connection.release();
    }
}