export const createUser = async (connection, data) =>{
    try {
        const [result] = await connection.query("INSERT INTO utilisateurs (email, password ,role) VALUES (?,?,?)",[
        data.email,
        data.matricule,
        data.role,
    ])

    return result.insertId;
    } catch (error) {
        throw error
    }
}

export const getUserById = async (id) => {
    try {
        const [rows] = await db.query("SELECT * FROM utilisateurs WHERE id = ?", [id]);
        return rows[0];
    } catch (error) {
        throw error;
    }

};
export const getAll = async (connection)=>{
    try {
        const users = await connection.query("SELECT * FROM utilisateurs")
        return users[0]
    } catch (error) {
        throw error
    }
}

export const findSUer = async (connection, email)=>{
    try {
        const [result] = await connection.query("SELECT * FROM utilisateurs WHERE email = ?", [email]);
        return result[0];
    } catch (error) {
        throw error
    }
}
export const findUserByMat = async (connection, password)=>{
    try {
        const [result] = await connection.query("SELECT * FROM utilisateurs WHERE password = ?", [password]);
        return result[0];
    } catch (error) {
        throw error
    }
}

export const updateUser = async (connection, id, data) => {
    try {
        const [result] = await connection.query("UPDATE utilisateurs SET email = ?, password = ?, role = ? WHERE id = ?", [
            data.email,
            data.matricule,
            data.role,
            id
        ]);
        return result;
    } catch (error) {
        throw error;
    }
}

export const deleteUserModel = async (connection, id)=>{
    try {
        const [result] = await connection.query("DELETE FROM utilisateurs WHERE id = ?", [id]);
        return result;
    } catch (error) {
        throw error;
    }
}