// Controller/adminController.js
import {
  createAdmin,
  getAllAdminsModel,
  getAdminByIdModel,
  updateAdminModel,
  deleteAdminModel,
} from "../Models/adminModel.js";
import { createUser, deleteUserModel, findSUer, findUserByMat, updateUser } from "../Models/userModel.js";
import { db } from "../server.js";
import path from "path";

export const registerAdmin = async (req, res) => {
  const { nom, email, matricule } = req.body;
  const fullPhotoPath = req.file ? req.file.path : null;

  if (!nom || !email || !matricule) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // construit chemin relatif pour la DB
  const photo_url = fullPhotoPath ? path.join("uploads", "admins", path.basename(fullPhotoPath)) : null;

  const userData = {
    email,
    matricule,
    role: "Admin", // rôle attribué côté serveur
  };

  const connection = await db.getConnection();

  try {
    const user = await findSUer(connection, email);
    const userMat = await findUserByMat(connection, matricule);

    if (user) {
      connection.release();
      return res.status(400).json({ message: "User already exists" });
    }
    if (userMat) {
      connection.release();
      return res.status(400).json({ message: "User already exists with this matricule" });
    }

    await connection.beginTransaction();

    const userId = await createUser(connection, userData); // retourne id utilisateur

    await createAdmin(connection, userId, {
      nom,
      photo_url,
    });

    await connection.commit();
    res.status(201).json({ message: "Admin registered successfully." });
  } catch (error) {
    await connection.rollback();
    console.error("Error registering admin:", error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    connection.release();
  }
};

export const getAllAdminsController = async (req, res) => {
  const connection = await db.getConnection();
  try {
    const admins = await getAllAdminsModel(connection);
    res.status(200).json(admins);
  } catch (error) {
    console.error("Error fetching admins:", error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    connection.release();
  }
};

export const getAdminByIdController = async (req, res) => {
  const connection = await db.getConnection();
  try {
    let { id } = req.params;
    id = parseInt(id);
    const admin = await getAdminByIdModel(connection, id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.status(200).json(admin);
  } catch (error) {
    console.error("Error fetching admin:", error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    connection.release();
  }
};

export const updateAdminController = async (req, res) => {
  const { nom, email, matricule } = req.body;
  let { id } = req.params;
  id = parseInt(id);

  if (!id || !nom || !email || !matricule) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // photo handling
  let updatedPhotoUrl = null;
  if (req.file) {
    updatedPhotoUrl = path.join("uploads", "admins", path.basename(req.file.path));
  } else if (req.body.photo) {
    // front may send existing photo url
    updatedPhotoUrl = req.body.photo;
  }

  const userData = { email, matricule }; // role n'est pas modifié ici (ou on peut le laisser tel quel)
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // update user table (email/matricule)
    await updateUser(connection, id, userData);

    // update admin table (nom/photo)
    const adminData = { nom, photo_url: updatedPhotoUrl };
    await updateAdminModel(connection, id, adminData);

    await connection.commit();
    res.status(200).json({ message: "Admin updated successfully." });
  } catch (error) {
    await connection.rollback();
    console.error("Error updating admin:", error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    connection.release();
  }
};

export const deleteAdminController = async (req, res) => {
  let { id } = req.params;
  id = parseInt(id);
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();
    await deleteAdminModel(connection, id);
    await deleteUserModel(connection, id);
    await connection.commit();
    res.status(200).json({ message: "Admin deleted successfully." });
  } catch (error) {
    await connection.rollback();
    console.error("Error deleting admin:", error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    connection.release();
  }
};
