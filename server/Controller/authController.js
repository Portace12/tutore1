// Controllers/authController.js
import { findUserByEmail, getFullUserById } from "../Models/authModel.js";
import { db } from "../server.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret_in_prod";
const JWT_EXPIRES = process.env.JWT_EXPIRES || "7d";

export const loginController = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    const connection = await db.getConnection();
    try {
        const user = await findUserByEmail(connection, email);
        if (!user) {
            connection.release();
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // ⚠️ comparaison simple sans hachage
        if (password !== user.password) {
            connection.release();
            return res.status(401).json({ message: "Invalid credentials" });
        }

        if (user.role === "Professor") {
            connection.release();
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const payload = {
            id: user.id,
            email: user.email,
            role: user.role,
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });

        const fullUser = await getFullUserById(connection, user.id, user.role);
        if (fullUser) delete fullUser.password;

        connection.release();

        return res.status(200).json({
            message: "Authenticated",
            token,
            userInfo: fullUser,
        });
    } catch (error) {
        connection.release();
        console.error("Error in loginController:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
