import express from 'express';
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = express.Router();

import addEmployee from '../../controllers/Housekeeping/addEmployee.js';
import getAllEmployees from '../../controllers/Housekeeping/getAllEmployees.js';
import fetchEmployeeById from '../../controllers/Housekeeping/getEmployeeById.js';
import postFoundData from '../../controllers/Housekeeping/lostAndFoundPost.js';
import patchClaimData from '../../controllers/Housekeeping/claimFoundItemPatch.js';
import getFoundData from '../../controllers/Housekeeping/getFoundData.js'

router.get("/api/getEmployeeById", fetchEmployeeById);
router.get("/api/getAllEmployees", getAllEmployees);
router.post('/api/addEmployeeDetails', upload.fields([{ name: 'document', maxCount: 1 }, { name: 'profilePhoto', maxCount: 1 }]), addEmployee);
router.post('/api/postFoundData', upload.fields([{ name: 'itemImage', maxCount: 5}]), postFoundData);
router.patch('/api/claimItem/:lostAndFoundId', upload.fields([{ name: 'imageProof', maxCount: 1}]), patchClaimData);
router.get('/api/getFoundData',getFoundData)

export default router;