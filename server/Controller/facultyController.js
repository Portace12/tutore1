import { createFacultyModel, deleteFacultyModel, getAllFacultyModel, getFacultyByIdModel, updateFacultyModel } from "../Models/facultyModel.js"
import { db } from "../server.js"

export const createFacultyController = async (req, res) => {
    const { nom, location } = req.body
    const data = { nom, location }
    const connection = await db.getConnection()
    try {
        await createFacultyModel(connection, data)
        res.status(201).json({ message: "Faculty created successfully" })
    } catch (error) {
        res.status(500).json({ error: error.message })
    } finally {
        connection.release()
    }
}

export const getByIdController = async (req, res) => {
    const connection = await db.getConnection()
    let { id } = req.params
    id = parseInt(id)
    try {
        const faculty = await getFacultyByIdModel(connection, id)
        if (faculty) {
            res.status(200).json(faculty)
        } else {
            res.status(404).json({ message: "Faculty not found" })
        }
    } catch (error) {
        res.status(500).json({ error: error.message })
    } finally {
        connection.release()
    }
}

export const getAllController = async (req, res) => {
    const connection = await db.getConnection()
    try {
        const faculties = await getAllFacultyModel(connection)
        res.status(200).json(faculties)
    } catch (error) {
        res.status(500).json({ error: error.message })
    } finally {
        connection.release()
    }
}

export const updateFacultyController = async (req, res) => {
    const { nom, location } = req.body
    const connection = await db.getConnection();
    let { id } = req.params
    id = parseInt(id)
    try {
        await updateFacultyModel(connection, id, { nom, location })
        res.status(200).json({ message: "Faculty updated successfully" })
    } catch (error) {
        res.status(500).json({ error: error.message })
    } finally {
        connection.release()
    }
}

export const deleteFacultyController = async (req, res) => {
    const connection = await db.getConnection()
    let { id } = req.params
    id = parseInt(id)
    try {
        await deleteFacultyModel(connection, id)
        res.status(200).json({ message: "Faculty deleted successfully" })
    } catch (error) {
        res.status(500).json({ error: error.message })
    } finally {
        connection.release()
    }
}