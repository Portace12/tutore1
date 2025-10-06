export const createCourseModel = async (connection, data) => {
    try {
        const [result] = await connection.query("INSERT INTO cours (cours,credit,id_promotion) VALUES (?, ?,?)", [
            data.cours,
            data.credit,
            data.promotion
        ])
        return result.insertId
    } catch (error) {
        throw error
    }
}
export const getAllCourseModel = async (connection) => {
    try {
        const [rows] = await connection.query("SELECT * FROM cours")
        return rows
    } catch (error) {
        throw error
    }
}

export const getCourseByIdModel = async (connection, id) => {
    try {
        const [row] = await connection.query('SELECT * FROM cours WHERE id = ?', [id])
        return row[0]
    } catch (error) {
        throw error
    }
}

export const updateCourseModel = async (connection, id, data) => {
    try {
        const [result] = await connection.query("UPDATE cours SET cours = ?,credit = ?, id_promotion = ? WHERE id = ?", [
            data.cours,
            data.credit,
            data.promotion,
            id
        ])
        return result
    } catch (error) {
        throw error
    }
}

export const deleteCourseModel = async (connection, id) => {
    try {
        const [result] = await connection.query("DELETE FROM cours WHERE id =? ", [id])
        return result
    } catch (error) {
        throw error
    }
}