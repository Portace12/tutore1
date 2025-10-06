import { createStudent, getAllStudentModel, getStudentByIdModel, updateStudentModel } from '../Models/studentModel.js';
import { createUser, deleteUserModel, findSUer, findUserByMat, updateUser } from '../Models/userModel.js';
import { db } from '../server.js'; // Importation du pool de connexions
import path from 'path';
export const registerStudent = async (req, res) => {
    const { nom, anniv, genre, email, matricule, role, promotion } = req.body;

    // Le chemin d'accès complet du fichier est dans req.file.path
    const fullPhotoPath = req.file ? req.file.path : null;

    if (!nom || !anniv || !genre || !email || !matricule || !role ||
        !promotion
    ) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Extrayez le chemin d'accès relatif que vous enregistrerez dans la base de données.
    // Il doit commencer par 'uploads/professors' ou une structure similaire.
    // L'utilisation de `path.basename` est utile pour cela.
    let photo_url
    if (fullPhotoPath) {
     photo_url = path.join('uploads', 'students', path.basename(fullPhotoPath));
    }else{
        photo_url = null
    }

    const userData = { email, matricule, role };
    const connection = await db.getConnection();

    const user = await findSUer(connection, email);
    const userMat = await findUserByMat(connection, matricule)
    if (user) {
        connection.release();
        return res.status(400).json({ message: "User already exists" });
    }
    if (userMat) {
        connection.release();
        return res.status(400).json({ message: "User already exists with this matricule" });
    }

    try {
        await connection.beginTransaction();

        const userId = await createUser(connection, userData);

        await createStudent(connection, userId, {
            nom, anniv, genre, photo_url, promotion
        });

        await connection.commit();
        res.status(201).json({ message: "Student registered successfully." });

    } catch (error) {
        await connection.rollback();
        console.error("Error during registration:", error);
        res.status(500).json({ message: "Internal server error during registration." });

    } finally {
        connection.release();
    }
};

export const getAllStudentController = async (req, res) => {
    const connection = await db.getConnection();
    try {
        const students = await getAllStudentModel(connection);
        return res.status(200).json(students);
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({ message: "Internal server error fetching students." });

    } finally {
        connection.release();
    }
}

export const getStudentByIdController = async (req, res) => {
    const connection = await db.getConnection();
    try {
        let { id } = req.params
        id = parseInt(id)
        const professor = await getStudentByIdModel(connection, id)
        res.status(200).json(professor)
    } catch (error) {
        console.error("Error fetching student:", error);
        res.status(500).json({ message: "Internal server error fetching professor." });

    } finally {
        connection.release();
    }
}

export const updateStudentController = async (req, res) => {
    const { nom, anniv, genre, email, matricule, role, promotion } = req.body;
    let { id } = req.params;
    id = parseInt(id);

    // Initialisez la variable de l'URL de la photo mise à jour
    let updatedPhotoUrl = null;

    // Si un nouveau fichier est uploadé, utilisez son chemin d'accès
    if (req.file) {
        // Créez le chemin relatif pour la base de données
        const relativePath = path.join('uploads', 'students', path.basename(req.file.path));
        updatedPhotoUrl = relativePath;
    } else if (req.body.photo) { // Utilisez 'photo' ici, pas 'photo_url'
        // Si la photo n'a pas été changée, le front-end envoie l'URL existante
        updatedPhotoUrl = req.body.photo;
    }

    if (!id || !nom || !anniv || !genre || !email || !matricule || !role
        || !promotion) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const userData = { email, matricule, role };
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        await updateUser(connection, id, userData);

        const professorData = { nom, anniv, genre, promotion };
        if (updatedPhotoUrl) {
            professorData.photo_url = updatedPhotoUrl;
        }

        await updateStudentModel(connection, id, professorData);
        await connection.commit();
        res.status(200).json({ message: "Student updated successfully." });

    } catch (error) {
        await connection.rollback();
        console.error("Error during update:", error);
        res.status(500).json({ message: "Internal server error during update." });
    } finally {
        connection.release();
    }
};

export const deleteStudentController = async (req, res) => {
    let { id } = req.params;
    id = parseInt(id);
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        // await deleteProfessorModel(connection, id);
        await deleteUserModel(connection, id);
        await connection.commit();
        res.status(200).json({ message: "Student deleted successfully." });
    } catch (error) {
        await connection.rollback();
        console.error("Error during deletion:", error);
        res.status(500).json({ message: "Internal server error during deletion." });
    } finally {
        connection.release();
    }
}