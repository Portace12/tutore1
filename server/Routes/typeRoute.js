import express from 'express'
import { createMultipleTypesController, createTypeController, deleteCTcontroller, getAllAssTypeController, getAllTypesController, getTypeByIdController, updateTypeController } from '../Controller/typeController.js'
const router = express.Router()

router.post('/create', createTypeController)
router.get('/get/:id', getTypeByIdController)
router.get('/get', getAllTypesController)
router.put('/update/:id', updateTypeController)
router.delete('/delete/:id', deleteCTcontroller)
router.get('/association', getAllAssTypeController)
router.post('/type/create-batch', createMultipleTypesController);

export default router;