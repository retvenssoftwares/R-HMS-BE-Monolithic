import express from 'express';
import { getUsers, getUser } from '../controllers/userController.js';
import userController from '../controllers/userController.js'

const router = express.Router();

router.get('/', getUsers);
router.get('/:id', getUser);
router.post("/create", userController.apiCreateUser);

export default router;