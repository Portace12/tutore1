import express from 'express'
import { createPromotionController, deletePromotionController, getAllPromotionsController, getPromotionByIdController, updatePromotionController } from '../Controller/promotionController.js'

const router = express.Router()
router.post('/create', createPromotionController)
router.get('/get', getAllPromotionsController)
router.get('/get/:id', getPromotionByIdController)
router.put('/update/:id', updatePromotionController)
router.delete('/delete/:id', deletePromotionController)

export default router