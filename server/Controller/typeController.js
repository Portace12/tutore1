import { createTypeCoursModel, createTypeModel, deleteCTmodel, getAllTypeModel, getAssociationTypeModel, getTypeByIdModel, updateCTmodel, updateTypeModel } from '../Models/TypeModel.js'
import { db } from '../server.js'

export const createTypeController = async (req, res) => {
    const { nom, cours, ponderation } = req.body
    const connection = await db.getConnection()

    try {
        let typeId = await createTypeModel(connection, { nom })

        await createTypeCoursModel(connection, { cours, typeId, ponderation })

        res.status(201).json({ message: "Type Evaluation created successfully" })
    } catch (error) {
        res.status(500).json({ error: error.message })
    } finally {
        connection.release()
    }
}

export const createMultipleTypesController = async (req, res) => {
    // On s'attend à recevoir un tableau d'objets (e.g., [ {nom, cours, ponderation}, ... ])
    const typesToCreate = req.body; 

    if (!Array.isArray(typesToCreate) || typesToCreate.length === 0) {
        return res.status(400).json({ error: "Invalid data: Expected a non-empty array of types." });
    }

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction(); // Démarrer une transaction pour garantir l'atomicité

        for (const typeData of typesToCreate) {
            const { nom, cours, ponderation } = typeData;

            // 1. Création du Type principal (si nécessaire)
            let typeId = await createTypeModel(connection, { nom });

            // 2. Association Type-Cours
            await createTypeCoursModel(connection, { cours, typeId, ponderation });
        }

        await connection.commit(); // Valider toutes les insertions
        
        res.status(201).json({ message: `${typesToCreate.length} Type Evaluation(s) created successfully` });
    } catch (error) {
        await connection.rollback(); // Annuler si une erreur survient
        console.error("Erreur lors de l'insertion multiple des types:", error);
        // Remonte l'erreur (souvent une erreur de clé unique, d'où le 409 Conflict)
        if (error.code === 'ER_DUP_ENTRY' || error.message.includes('duplicate')) {
             return res.status(409).json({ error: "One or more types already exist for the selected courses." });
        }
        res.status(500).json({ error: "Server error during batch creation: " + error.message });
    } finally {
        connection.release();
    }
}

export const getAllTypesController = async (req, res) => {
    const connection = await db.getConnection()
    try {
        const types = await getAllTypeModel(connection)
        res.status(200).json(types)
    } catch (error) {
        res.status(500).json({ error: error.message })
    } finally {
        connection.release()
    }
}

export const getAllAssTypeController = async (req, res) => {
    const connection = await db.getConnection()
    try {
        const associations = await getAssociationTypeModel(connection)
        res.status(200).json(associations)
    } catch (error) {
        res.status(500).json({ error: error.message })
    } finally {
        connection.release()
    }
}

export const getTypeByIdController = async (req, res) => {
    const connection = await db.getConnection()
    let { id } = req.params
    id = parseInt(id)

    try {
        const course = await getTypeByIdModel(connection, id)
        if (course) {
            res.status(200).json(course)
        } else {
            res.status(404).json({ message: "Type not found" })
        }
    } catch (error) {
        res.status(500).json({ error: error.message })
    } finally {
        connection.release()
    }
}

export const updateTypeController = async (req, res) => {
    const { nom, ponderation } = req.body;
    let { id } = req.params;

    id = parseInt(id);

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        await updateTypeModel(connection, id, nom)
        await updateCTmodel(connection, id, ponderation)

        await connection.commit();
        res.status(200).json({ message: "Type updated successfully." });

    } catch (error) {
        await connection.rollback();
        console.error("Transaction failed:", error);
        res.status(500).json({ error: "An error occurred during the update." });

    } finally {
        connection.release();
    }
};

export const deleteCTcontroller = async (req, res) => {
    const connection = await db.getConnection()
    let { id } = req.params
    id = parseInt(id)
    try {
        await deleteCTmodel(connection, id)
        res.status(200).json({ message: "Type deleted successfully" })
    } catch (error) {
        res.status(500).json({ error: error.message })
    } finally {
        connection.release()
    }
}