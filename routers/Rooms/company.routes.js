import express from 'express';
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = express.Router();



import company from '../../controllers/Rooms/companiesList.js';
import { companyLedgerDetails } from '../../controllers/Rooms/getCompanyLedger.js';


router.get('/api/companyName',company);



router.get("/api/getComapnyLedger",companyLedgerDetails)

export default router;