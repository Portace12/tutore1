// Fichier : ../Models/resultatModel.js

import { db } from "../server.js";

/**
 * Crée ou met à jour le résultat global d'un étudiant.
 * @param {object} connection - L'objet de connexion à la BDD.
 * @param {object} data - { id_etudiant, note_finale_600, pourcentage_final, historique_complet (JSON string), credits_valides, validation_globale }
 */
export const saveResultatModel = async (connection, data) => {
    // Les noms des variables reflètent la nouvelle structure de la BDD
    const { 
        id_etudiant, 
        note_finale_600, 
        pourcentage_final, 
        historique_complet,
        credits_valides, // NOUVEAU
        validation_globale // NOUVEAU
    } = data;
    
    try {
        // 1. Vérifier si un enregistrement existe déjà pour cet étudiant
        const [existing] = await connection.query(
            "SELECT id FROM resultats_globaux WHERE id_etudiant=?",
            [id_etudiant]
        );

        if (existing.length > 0) {
            // Update
            // ATTENTION : Correction de la syntaxe MySQL (colonne=?, colonne=?)
            const [result] = await connection.query(
                `UPDATE resultats_globaux 
                SET note_finale_600=?, 
                    pourcentage_final=?,
                    credits_valides=?, 
                    validation_globale=?, 
                    historique_complet=?, 
                    updated_at=NOW() 
                WHERE id_etudiant=?`,
                [note_finale_600, pourcentage_final, credits_valides, validation_globale, historique_complet, id_etudiant]
            );
            return { id: existing[0].id, updated: true, result };
        } else {
            // Insert
            // ATTENTION : Ajout des colonnes et des placeholders (?) pour credits_valides et validation_globale
            const [result] = await connection.query(
                `INSERT INTO resultats_globaux 
                (id_etudiant, note_finale_600, pourcentage_final, credits_valides, validation_globale, historique_complet) 
                VALUES (?,?,?,?,?,?)`,
                [id_etudiant, note_finale_600, pourcentage_final, credits_valides, validation_globale, historique_complet]
            );
            return { id: result.insertId, updated: false, result };
        }
    } catch (error) {
        throw error;
    }
};

/**
 * Récupère le résultat global d'un étudiant.
 * Les autres fonctions (getResultatsByEtudiantModel, getResultats) sont correctes
 * car elles utilisent SELECT * et ne nécessitent pas de modification tant que
 * les colonnes existent.
 */

export const getResultatsByEtudiantModel = async (connection, id_etudiant) => {
    try {
        const [rows] = await connection.query(
            "SELECT * FROM resultats_globaux WHERE id_etudiant=?",
            [id_etudiant]
        );
        return rows[0] || null;
    } catch (error) {
        throw error;
    }
};

export const getResultats = async (connection) => {
    try {
        const [rows] = await connection.query(
            "SELECT * FROM resultats_globaux"
        );
        return rows
    } catch (error) {
        throw error;
    }
};