import express from 'express';
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = express.Router();

import addEmployee from '../../controllers/Housekeeping/addEmployee.js';
import getAllEmployees from '../../controllers/Housekeeping/getAllEmployees.js';
import fetchEmployeeById from '../../controllers/Housekeeping/getEmployeeById.js';
import getAllEmployeesByDept from "../../controllers/Housekeeping/getDepartmentEmployees.js";
import editEmployeeDetails from '../../controllers/Housekeeping/patchEmployeeData.js';
import postTask from '../../controllers/Housekeeping/postTask.js'
import getTasktype from "../../controllers/Housekeeping/getTaskType.js"

router.get("/api/getEmployeeById", fetchEmployeeById);
router.get("/api/getAllEmployees", getAllEmployees);
router.post("/api/addTask", postTask);
router.patch("/api/editEmployeeData", upload.fields([{ name: 'document', maxCount: 1 }, { name: 'profilePhoto', maxCount: 1 }]), editEmployeeDetails);
router.get("/api/getDeptEmployees", getAllEmployeesByDept);
router.post('/api/addEmployeeDetails', upload.fields([{ name: 'document', maxCount: 1 }, { name: 'profilePhoto', maxCount: 1 }]), addEmployee)
router.get("/api/getTasktype", getTasktype)

export default router;