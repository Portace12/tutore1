export const createDepartementModel = async (connection, data) => {
    try {
        const [result] = await connection.query(
            "INSERT INTO departements (nom_departement, id_faculte) VALUES (?, ?)",
            [data.nom, data.id]
        )
        return result
    } catch (error) {
        throw error
    }
}

export const getAllDepartementsModel = async (connection) => {
    try {
        const [rows] = await connection.query("SELECT * FROM departements")
        return rows
    } catch (error) {
        throw error
    }
}

export const getDepartementByIdModel = async (connection, id) => {
    try {
        const [rows] = await connection.query("SELECT * FROM departements WHERE id = ?", [id])
        return rows[0]
    } catch (error) {
        throw error
    }
}

export const updateDepartementModel = async (connection, id, nom) => {
    try {
        const [result] = await connection.query(
            "UPDATE departements SET nom_departement = ? WHERE id = ?",
            [nom, id]
        )
        return result
    } catch (error) {
        throw error
    }
}

export const deleteDepartementModel = async (connection, id) => {
    try {
        const [result] = await connection.query(
            "DELETE FROM departements WHERE id = ?",
            [id]
        )
        return result
    } catch (error) {
        throw error
    }
}