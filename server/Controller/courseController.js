import { createCourseModel, deleteCourseModel, getAllCourseModel, getCourseByIdModel, updateCourseModel } from '../Models/courseModel.js'
import { createCoursProfModel, deleteCPmodel, getAssByIdModel, updateCPmodel } from '../Models/coursProfModel.js'
import { db } from '../server.js'

export const createCourseController = async (req, res) => {
    const { cours, promotion, professeurId, credit } = req.body
    const connection = await db.getConnection()
    try {
        let coursId = await createCourseModel(connection, { cours, credit, promotion })

        if (professeurId !== 'none') {
            await createCoursProfModel(connection, { coursId, professeurId })
        }

        res.status(201).json({ message: "Course created successfully" })
    } catch (error) {
        res.status(500).json({ error: error.message })
    } finally {
        connection.release()
    }
}

export const getAllCoursesController = async (req, res) => {
    const connection = await db.getConnection()
    try {
        const courses = await getAllCourseModel(connection)
        res.status(200).json(courses)
    } catch (error) {
        res.status(500).json({ error: error.message })
    } finally {
        connection.release()
    }
}

export const getCourseByIdController = async (req, res) => {
    const connection = await db.getConnection()
    let { id } = req.params
    id = parseInt(id)

    try {
        const course = await getCourseByIdModel(connection, id)
        if (course) {
            res.status(200).json(course)
        } else {
            res.status(404).json({ message: "Course not found" })
        }
    } catch (error) {
        res.status(500).json({ error: error.message })
    } finally {
        connection.release()
    }
}

export const updateCourseController = async (req, res) => {
    const { cours, promotion, professeur, credit } = req.body;
    let { id } = req.params;

    id = parseInt(id);

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // Étape 1: Mettre à jour les informations du cours (cours et promotion)
        await updateCourseModel(connection, id, { cours, credit, promotion });

        // Étape 2: Gérer l'association avec le professeur
        const associationExists = await getAssByIdModel(connection, id);

        if (professeur && professeur !== 'none') {
            // Cas 1: Le professeur est spécifié (mise à jour ou création)
            if (associationExists.length > 0) {
                // L'association existe, on la met à jour
                await updateCPmodel(connection, id, professeur);
            } else {
                // L'association n'existe pas, on la crée
                const data = {
                    coursId: id,
                    professeurId: professeur
                };
                await createCoursProfModel(connection, data);
            }
        } else {
            // Cas 2: Le professeur n'est pas spécifié (suppression de l'association)
            if (associationExists.length > 0) {
                // L'association existe et on veut la supprimer
                await deleteCPmodel(connection, id);
            }
            // Si l'association n'existe pas, il n'y a rien à faire.
        }

        await connection.commit();
        res.status(200).json({ message: "Course updated successfully." });

    } catch (error) {
        await connection.rollback();
        console.error("Transaction failed:", error);
        res.status(500).json({ error: "An error occurred during the update." });

    } finally {
        connection.release();
    }
};

export const deleteCourseController = async (req, res) => {
    const connection = await db.getConnection()
    let { id } = req.params
    id = parseInt(id)
    try {
        await deleteCourseModel(connection, id)
        res.status(200).json({ message: "Course deleted successfully" })
    } catch (error) {
        res.status(500).json({ error: error.message })
    } finally {
        connection.release()
    }
}