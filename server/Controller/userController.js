import { getAll } from "../Models/userModel.js";
import { db } from '../server.js'

export const getAllUserController = async (req, res) => {
    const connection =await db.getConnection()
    try {
        const users = await getAll(connection);
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
    finally{
        connection.release();
    }
}
