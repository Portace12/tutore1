export const createFacultyModel = async (connection, data)=>{
    try {
        const [result] = await connection.query("INSERT INTO facultes (nom_faculte, location) VALUES (?,?)",[
            data.nom,
            data.location
        ])
        return result
    } catch (error) {
        throw error
    }
}

export const getFacultyByIdModel = async (connection, id)=>{
    try {
        const [rows] = await connection.query("SELECT * FROM facultes WHERE id = ?", [id])
        return rows[0]
    } catch (error) {
        throw error
    }
}
export const getAllFacultyModel = async (connection)=>{
    try {
        const [rows] = await connection.query("SELECT * FROM facultes")
        return rows
    } catch (error) {
        throw error
    }
}

export const updateFacultyModel = async (connection, id, data)=>{
    try {
        const [result] = await connection.query("UPDATE facultes SET nom_faculte = ?, location = ? WHERE id = ?", [
            data.nom,
            data.location,
            id
        ])
        return result
    } catch (error) {
        throw error
    }
}

export const deleteFacultyModel = async (connection, id)=>{
    try {
        const [result] = await connection.query("DELETE FROM facultes WHERE id = ?", [id])
        return result
    } catch (error) {
        throw error
    }
}