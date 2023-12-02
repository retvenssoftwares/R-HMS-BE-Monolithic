import express from 'express';
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = express.Router();

import addEmployee from '../../controllers/Housekeeping/addEmployee.js';
import getAllEmployees from '../../controllers/Housekeeping/getAllEmployees.js';
import fetchEmployeeById from '../../controllers/Housekeeping/getEmployeeById.js';

router.get("/api/getEmployeeById", fetchEmployeeById);
router.get("/api/getAllEmployees", getAllEmployees);
router.post('/api/addEmployeeDetails', upload.fields([{ name: 'document', maxCount: 1 }, { name: 'profilePhoto', maxCount: 1 }]), addEmployee)

export default router;