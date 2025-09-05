import express from 'express'
import { createDepartementController, deleteDepartementController, getAllDepartementsController, getDepartementByIdController, updateDepartementController } from '../Controller/departementController.js'
const router = express.Router()

router.post('/create', createDepartementController)
router.get('/get', getAllDepartementsController)
router.get('/get/:id', getDepartementByIdController)
router.put('/update/:id', updateDepartementController)
router.delete('/delete/:id', deleteDepartementController)

export default router