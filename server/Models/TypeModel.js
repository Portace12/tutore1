export const createTypeModel = async (connection, data) => {
    try {
        const [result] = await connection.query("INSERT INTO types_evaluation (libelle) VALUES (?)", [
            data.nom,
        ])
        return result.insertId
    } catch (error) {
        throw error
    }
}
export const getAllTypeModel = async (connection) => {
    try {
        const [rows] = await connection.query("SELECT * FROM types_evaluation")
        return rows
    } catch (error) {
        throw error
    }
}

export const getTypeByIdModel = async (connection, id) => {
    try {
        const [row] = await connection.query('SELECT * FROM types_evaluation WHERE id = ?', [id])
        return row[0]
    } catch (error) {
        throw error
    }
}

export const updateTypeModel = async (connection, id, nom)=>{
    try {
        const [result] = await connection.query("UPDATE types_evaluation SET libelle = ? WHERE id = ?", [
            nom,
            id
        ])
        return result
    } catch (error) {
        throw error
    }
}

export const deleteTypeModel = async (connection, id)=>{
    try {
        const [result] = await connection.query("DELETE FROM types_evaluation WHERE id =? ", [id])
        return result
    } catch (error) {
        throw error
    }
}

// pour l'association alors

export const createTypeCoursModel = async (connection, data) => {
    try {
        const [result] = await connection.query(
            "INSERT INTO cours_evaluation (id_cours, id_type_evaluation, ponderation) VALUES (?, ?, ?)",
            [data.cours, data.typeId, data.ponderation]
        );
        return result;
    } catch (error) {
        throw error;
    }
};

export const getAssociationTypeModel = async (connection) => {
    try {
        const [rows] = await connection.query("SELECT * FROM cours_evaluation")
        return rows
    } catch (error) {
        throw error
    }
}

export const getAssTypeByIdModel = async (connection, id) => {
    try {
        const [rows] = await connection.query("SELECT * FROM cours_evaluation WHERE id_type_evaluation = ?", [id])
        return rows
    } catch (error) {
        throw error
    }
}

export const updateCTmodel = async (connection, id, ponderation) => {
    try {
        const [result] = await connection.query("UPDATE cours_evaluation SET ponderation = ? WHERE id_type_evaluation = ?", [
            ponderation,
            id
        ])
        return result
    } catch (error) {
        throw error
    }
}

export const deleteCTmodel = async (connection, id) => {
    try {
        const [result] = await connection.query("DELETE FROM cours_evaluation WHERE id_type_evaluation = ?", [id])
        return result
    } catch (error) {
        throw error
    }
}