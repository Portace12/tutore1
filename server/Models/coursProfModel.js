export const createCoursProfModel = async (connection, data) => {
    try {
        const [result] = await connection.query(
            "INSERT INTO professeur_cours (id_cours, id_professeur) VALUES (?, ?)",
            [data.coursId, data.professeurId]
        );
        return result;
    } catch (error) {
        throw error;
    }
};

export const getAssociationModel = async (connection) => {
    try {
        const [rows] = await connection.query("SELECT * FROM professeur_cours")
        return rows
    } catch (error) {
        throw error
    }
}

export const getAssByIdModel = async (connection, id) => {
    try {
        const [rows] = await connection.query("SELECT * FROM professeur_cours WHERE id_cours = ?", [id])
        return rows
    } catch (error) {
        throw error
    }
}

export const updateCPmodel = async (connection, id, professeur) => {
    try {
        const [result] = await connection.query("UPDATE professeur_cours SET id_professeur = ? WHERE id_cours = ?", [
            professeur,
            id
        ])
        return result
    } catch (error) {
        throw error
    }
}

export const deleteCPmodel = async (connection, id) => {
    try {
        const [result] = await connection.query("DELETE FROM professeur_cours WHERE id_cours = ?", [id])
        return result
    } catch (error) {
        throw error
    }
}