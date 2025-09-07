import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import "dotenv/config";
const app = express()
import professorRoutes from './Routes/professorRoutes.js';
import facultyRoutes from "./Routes/facultyRoute.js"
import departementRoutes from './Routes/departementRoute.js'
import promotionRoutes from './Routes/promotionRoute.js';
import path from "path";
import { fileURLToPath } from "url";
import userRoutes from './Routes/userRoute.js'
import studentRoutes from './Routes/studentRoutes.js'

app.use(express.json())
app.use(cors())

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/professors', professorRoutes)
app.use('/api/faculty', facultyRoutes)
app.use('/api/departement', departementRoutes)
app.use('/api/promotion', promotionRoutes)
app.use('/api/user', userRoutes)
app.use('/api/student', studentRoutes)

app.get('/', (req, res) => {
  res.send('API is running...');
});

export const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "gestion",
});

db.getConnection()
  .then(connection => {
    console.log('Connexion à la base de données réussie.');
    connection.release();
  })
  .catch(err => {
    console.error('Erreur de connexion à la base de données:', err);
  });

const port = 4000

const expressServer = app.listen(port, (req, res) => {
  console.log(`Le serveur demarre sur le port: ${port}`);
})

