export const createPromotionModel = async (connection, data) => {
    try {
        const [result] = await connection.query("INSERT INTO promotions (nom_promotion, annee, id_departement) VALUES (?, ?, ?)", [data.nom, data.annee, data.id])
        return result
    } catch (error) {
        throw error
    }
}

export const getAllPromotionsModel = async (connection) => {
    try {
        const [rows] = await connection.query("SELECT * FROM promotions")
        return rows
    } catch (error) {
        throw error
    }
}

export const getPromotionByIdModel = async (connection, id) => {
    try {
        const [rows] = await connection.query("SELECT * FROM promotions WHERE id = ?", [id])
        return rows[0]
    } catch (error) {
        throw error
    }
}

export const updatePromotionModel = async (connection, id, data) => {
    try {
        const [result] = await connection.query("UPDATE promotions SET nom_promotion = ?, annee = ? WHERE id = ?", [data.nom, data.annee, id])
        return result
    } catch (error) {
        throw error
    }
}

export const deletePromotionModel = async (connection, id) => {
    try {
        const [result] = await connection.query("DELETE FROM promotions WHERE id = ?", [id])
        return result
    } catch (error) {
        throw error
    }
}