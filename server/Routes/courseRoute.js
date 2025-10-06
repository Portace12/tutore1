import express from 'express'
import { createCourseController, deleteCourseController, getAllCoursesController, getCourseByIdController, updateCourseController } from '../Controller/courseController.js'
import { getAssociationController } from '../Controller/coursProfController.js'
const router = express.Router()

router.post('/create', createCourseController)
router.get('/get/:id', getCourseByIdController)
router.get('/get', getAllCoursesController)
router.put('/update/:id', updateCourseController)
router.delete('/delete/:id', deleteCourseController)
router.get('/association', getAssociationController)

export default router;