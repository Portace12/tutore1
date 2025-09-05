import { createPromotionModel, deletePromotionModel, getAllPromotionsModel, getPromotionByIdModel, updatePromotionModel } from "../Models/promotionModel.js"
import { db } from "../server.js"

export const createPromotionController = async (req, res) => {
    const connection = await db.getConnection()
    const { nom, annee, id } = req.body
    if (!nom || !annee || !id) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        await createPromotionModel(connection, { nom, annee, id })
        res.status(201).json({ message: "Promotion created successfully" })
    } catch (error) {
        res.status(500).json({ message: "Error creating promotion", error: error.message })
    } finally {
        connection.release()
    }
}

export const getAllPromotionsController = async (req, res) => {
    const connection = await db.getConnection()
    try {
        const promotions = await getAllPromotionsModel(connection)
        res.status(200).json(promotions)
    } catch (error) {
        res.status(500).json({ message: "Error fetching promotions", error: error.message })
    } finally {
        connection.release()
    }
}

export const getPromotionByIdController = async (req, res) => {
    const connection = await db.getConnection()
    let { id } = req.params
    id = parseInt(id)
    try {
        const promotion = await getPromotionByIdModel(connection, id)
        if (promotion) {
            res.status(200).json(promotion)
        } else {
            res.status(404).json({ message: "Promotion not found" })
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching promotion", error: error.message })
    } finally {
        connection.release()
    }
}

export const updatePromotionController = async (req, res) => {
    const connection = await db.getConnection()
    let { id } = req.params
    id = parseInt(id)
    const { nom, annee } = req.body
    try {
        const result = await updatePromotionModel(connection, id, { nom, annee })
        if (result.affectedRows > 0) {
            res.status(200).json({ message: "Promotion updated successfully" })
        } else {
            res.status(404).json({ message: "Promotion not found" })
        }
    } catch (error) {
        res.status(500).json({ message: "Error updating promotion", error: error.message })
    } finally {
        connection.release()
    }
}

export const deletePromotionController = async (req, res) => {
    const connection = await db.getConnection()
    let { id } = req.params
    id = parseInt(id)
    try {
        const result = await deletePromotionModel(connection, id)
        if (result.affectedRows > 0) {
            res.status(200).json({ message: "Promotion deleted successfully" })
        } else {
            res.status(404).json({ message: "Promotion not found" })
        }
    } catch (error) {
        res.status(500).json({ message: "Error deleting promotion", error: error.message })
    } finally {
        connection.release()
    }
}