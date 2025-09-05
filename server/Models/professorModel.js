export const createProfessor = async (connection, id, data) => {
    try {
        const [result] = await connection.query("INSERT INTO professeurs (id_utilisateur, nom, anniv, adress, numero, genre, grade, photo_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [
            id,
            data.nom,
            data.anniv,
            data.adress,
            data.numero,
            data.genre,
            data.grade,
            data.photo_url
        ])
        return result
    } catch (error) {
        throw error
    }

}

export const getAllProfessorModel = async (connection) => {
    try {
        const professors = await connection.query("SELECT * FROM professeurs");
        return professors[0];
    } catch (error) {
        throw error;
    }
}

export const getProfessorByIdModel = async (connection,id)=>{
    try {
        const professor = await connection.query("SELECT * FROM professeurs WHERE id = ?", [id])
        return professor[0]
    } catch (error) {
        throw error
    }
}

export const updateProfessorModel = async (connection, id, data)=>{
    try {
        const [result] = await connection.query("UPDATE professeurs SET nom = ?, anniv = ?, adress = ?, numero = ?, genre = ?, grade = ?, photo_url = ? WHERE id_utilisateur = ?", [
            data.nom,
            data.anniv,
            data.adress,
            data.numero,
            data.genre,
            data.grade,
            data.photo_url,
            id
        ])
        return result
    } catch (error) {
        throw error
    }
}

export const deleteProfessorModel = async (connection, id)=>{
    try {
        const [result] = await connection.query("DELETE FROM professeurs WHERE id_utilisateur = ?", [id]);
        return result;
    } catch (error) {
        throw error;
    }
}