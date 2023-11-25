import express from 'express';
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = express.Router();

import addCompany from '../../controllers/Rooms/addCompany.js';

import company from '../../controllers/Rooms/companiesList.js';
import { companyLedgerDetails } from '../../controllers/Rooms/getCompanyLedger.js';
router.get('/api/companyName',company);


router.post("/api/addCompany", upload.fields([{ name: 'companyLogo', maxCount: 1 }, { name: 'contractPdf', maxCount: 1 }]), addCompany)
router.get("/api/getComapnyLedger",companyLedgerDetails)

export default router;