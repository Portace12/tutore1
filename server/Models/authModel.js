// Models/authModel.js
export const findUserByEmail = async (connection, email) => {
  const [rows] = await connection.query(
    `SELECT * FROM utilisateurs WHERE email = ? LIMIT 1`,
    [email]
  );
  return rows[0] || null;
};

export const findUserById = async (connection, id) => {
  const [rows] = await connection.query(
    `SELECT * FROM utilisateurs WHERE id = ? LIMIT 1`,
    [id]
  );
  return rows[0] || null;
};

export const getFullUserById = async (connection, id, role) => {
  // Colonnes de base de la table 'utilisateurs'
  let query = `
    SELECT 
      u.id AS user_id,
      u.email,
      u.password,
      u.role
  `;

  // Clause FROM de base
  let joinClause = `
    FROM utilisateurs u
  `;

  // Ajout des colonnes et du JOIN selon le rôle
  if (role === "Admin") {
    query += `,
      a.id AS admin_id,
      a.nom AS admin_nom,
      a.photo_url AS admin_photo_url
    `;
    joinClause += `
      LEFT JOIN admins a ON a.id_utilisateur = u.id
    `;
  } else if (role === "Professor") {
    query += `,
      p.id AS professor_id,
      p.nom AS professor_nom,
      p.anniv AS professor_anniv,
      p.genre AS professor_genre,
      p.grade AS professor_grade,
      p.adress AS professor_adress,
      p.numero AS professor_numero,
      p.photo_url AS professor_photo_url
    `;
    joinClause += `
      LEFT JOIN professeurs p ON p.id_utilisateur = u.id
    `;
  } else if (role === "Student") {
    query += `,
      s.id AS student_id,
      s.nom AS student_nom,
      s.anniv AS student_anniv,
      s.genre AS student_genre,
      s.id_promotion AS student_promotion_id,
      s.photo_url AS student_photo_url
    `;
    joinClause += `
      LEFT JOIN etudiants s ON s.id_utilisateur = u.id
    `;
  }

  // Requête finale
  query += `
    ${joinClause}
    WHERE u.id = ?
    LIMIT 1
  `;

  // Exécution de la requête avec l'ID de l'utilisateur comme paramètre
  const [rows] = await connection.query(query, [id]);

  // Retourne le premier résultat (car il n'y en aura qu'un) ou null
  return rows[0] || null;
};