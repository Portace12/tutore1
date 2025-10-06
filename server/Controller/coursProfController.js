import { getAssociationModel } from "../Models/coursProfModel.js"
import { db } from "../server.js"

export const getAssociationController = async (req, res) => {
    const connection = await db.getConnection()
    try {
        const association = await getAssociationModel(connection)
        res.status(200).json(association)
    } catch (error) {
        res.status(500).json({ error: error.message })
    } finally {
        connection.release()
    }
}