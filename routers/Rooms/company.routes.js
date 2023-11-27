import express from 'express';
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = express.Router();

import addCompany from '../../controllers/Property/company.js';

import company from '../../controllers/Rooms/companiesList.js';
import { companyLedgerDetails } from '../../controllers/Rooms/getCompanyLedger.js';
import updateCompany from "../../controllers/Property/patchCompany.js";

router.get('/api/companyName',company);

router.patch(
    "/api/updateCompany",
    upload.fields([
      { name: "contractPdf", maxCount: 5 },
      { name: "companyLogo", maxCount: 1 },
    ]),
    updateCompany
  );

router.post("/api/addCompany", upload.fields([{ name: 'companyLogo', maxCount: 1 }, { name: 'contractPdf', maxCount: 5 }]), addCompany)
router.get("/api/getComapnyLedger",companyLedgerDetails)

export default router;