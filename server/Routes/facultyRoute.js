import express from 'express'
import { createFacultyController, deleteFacultyController, getAllController, getByIdController, updateFacultyController } from '../Controller/facultyController.js';
const router = express.Router()

router.post('/create', createFacultyController)
router.get('/get/:id', getByIdController)
router.get('/get', getAllController)
router.put('/update/:id', updateFacultyController)
router.delete('/delete/:id', deleteFacultyController)

export default router;