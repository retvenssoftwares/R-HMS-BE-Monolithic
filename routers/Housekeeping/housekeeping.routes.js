import express from 'express';
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = express.Router();

import addEmployee from '../../controllers/Housekeeping/addEmployee.js';

router.post('/api/addEmployeeDetails', upload.fields([{ name: 'document', maxCount: 1 }, { name: 'profilePhoto', maxCount: 1 }]), addEmployee)

export default router;