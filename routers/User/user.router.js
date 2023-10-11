import express from 'express';
// const multer = require('multer');
// import multer from 'multer';
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });
import postUser from '../../controllers/User/userController.js'

const router = express.Router();

router.post("/addUser", postUser);

export default router;