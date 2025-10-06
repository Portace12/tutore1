export const createStudent = async (connection, id, data) => {
    try {
        const [result] = await connection.query("INSERT INTO etudiants (id_utilisateur, nom, anniv, genre, photo_url, id_promotion) VALUES (?, ?, ?, ?, ?, ?)", [
            id,
            data.nom,
            data.anniv,
            data.genre,
            data.photo_url,
            data.promotion
        ])
        return result
    } catch (error) {
        throw error
    }

}

export const getAllStudentModel = async (connection) => {
    try {
        const students = await connection.query("SELECT * FROM etudiants");
        return students[0];
    } catch (error) {
        throw error;
    }
}

export const getStudentByIdModel = async (connection,id)=>{
    try {
        const student = await connection.query("SELECT * FROM etudiants WHERE id = ?", [id])
        return student[0]
    } catch (error) {
        throw error
    }
}

export const updateStudentModel = async (connection, id, data)=>{
    try {
        const [result] = await connection.query("UPDATE etudiants SET nom = ?, anniv = ?, genre = ?, photo_url = ?, id_promotion =? WHERE id_utilisateur = ?", [
            data.nom,
            data.anniv,
            data.genre,
            data.photo_url,
            data.promotion,
            id
        ])
        return result
    } catch (error) {
        throw error
    }
}

export const deleteStudentModel = async (connection, id)=>{
    try {
        const [result] = await connection.query("DELETE FROM etudiants WHERE id_utilisateur = ?", [id]);
        return result;
    } catch (error) {
        throw error;
    }
}