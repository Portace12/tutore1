import { createDepartementModel, deleteDepartementModel, getAllDepartementsModel, getDepartementByIdModel, updateDepartementModel } from "../Models/departementModel.js"
import { db } from "../server.js"

export const createDepartementController = async (req, res) => {
    const connection = await db.getConnection()
    const { nom, id } = req.body
    try {
        await createDepartementModel(connection, { nom, id })
        res.status(201).json({ message: "Department created successfully", })
    } catch (error) {
        res.status(500).json({ message: "Error creating department", error: error.message })
    }
    finally {
        connection.release()
    }
}

export const getAllDepartementsController = async (req, res) => {
    const connection = await db.getConnection()
    try {
        const departements = await getAllDepartementsModel(connection)
        res.status(200).json(departements)
    } catch (error) {
        res.status(500).json({ message: "Error fetching departments", error: error.message })
    }
    finally {
        connection.release()
    }
}

export const getDepartementByIdController = async (req, res) => {
    const connection = await db.getConnection()
    let { id } = req.params
    id = parseInt(id)
    try {
        const departement = await getDepartementByIdModel(connection, id)
        if (departement) {
            res.status(200).json(departement)
        } else {
            res.status(404).json({ message: "Department not found" })
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching department", error: error.message })
    }
    finally {
        connection.release()
    }
}

export const updateDepartementController = async (req, res) => {
    const connection = await db.getConnection()
    const { nom } = req.body
    let { id } = req.params
    id = parseInt(id)
    try {
        await updateDepartementModel(connection, id, nom)
        res.status(200).json({ message: "Department updated successfully" })
    } catch (error) {
        res.status(500).json({ message: "Error updating department", error: error.message })
    }
    finally {
        connection.release()
    }
}

export const deleteDepartementController = async (req, res) => {
    const connection = await db.getConnection()
    let { id } = req.params
    id = parseInt(id)
    try {
        await deleteDepartementModel(connection, id)
        res.status(200).json({ message: "Department deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: "Error deleting department", error: error.message })
    }
    finally {
        connection.release()
    }
}