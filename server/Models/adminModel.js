// Models/adminModel.js
export const createAdmin = async (connection, id, data) => {
  try {
    const [result] = await connection.query(
      "INSERT INTO admins (id_utilisateur, nom, photo_url) VALUES (?, ?, ?)",
      [id, data.nom, data.photo_url]
    );
    return result;
  } catch (error) {
    throw error;
  }
};

export const getAllAdminsModel = async (connection) => {
  try {
    // join with utilisateurs to return email/matricule if needed
    const [admins] = await connection.query(
      `SELECT a.*, u.email AS email, u.password AS matricule, u.role AS role
       FROM admins a
       LEFT JOIN utilisateurs u ON a.id_utilisateur = u.id`
    );
    return admins;
  } catch (error) {
    throw error;
  }
};

export const getAdminByIdModel = async (connection, id) => {
  try {
    const [admin] = await connection.query(
      `SELECT a.*, u.email AS email, u.password AS password
       FROM admins a
       LEFT JOIN utilisateurs u ON a.id_utilisateur = u.id
       WHERE a.id = ? OR a.id_utilisateur = ?`,
      [id, id]
    );
    return admin[0] ? admin[0] : null;
  } catch (error) {
    throw error;
  }
};

export const updateAdminModel = async (connection, id, data) => {
  try {
    const [result] = await connection.query(
      "UPDATE admins SET nom = ?, photo_url = ? WHERE id_utilisateur = ?",
      [data.nom, data.photo_url, id]
    );
    return result;
  } catch (error) {
    throw error;
  }
};

export const deleteAdminModel = async (connection, id) => {
  try {
    const [result] = await connection.query(
      "DELETE FROM admins WHERE id_utilisateur = ?",
      [id]
    );
    return result;
  } catch (error) {
    throw error;
  }
};
