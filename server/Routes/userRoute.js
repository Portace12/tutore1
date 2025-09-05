import express from 'express';
import { getAllUserController } from '../Controller/userController.js';

const router = express.Router();

router.get('/get', getAllUserController);

export default router;