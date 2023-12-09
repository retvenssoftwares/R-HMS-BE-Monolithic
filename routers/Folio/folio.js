import express from 'express';
const router = express.Router();
import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


import {addCharges} from "../../controllers/Folio/addCharges.js"
import {addAdjustment} from "../../controllers/Folio/addAdjustment.js"
import { addDiscount } from '../../controllers/Folio/addDiscount.js';
import { addPayment } from '../../controllers/Folio/addPayment.js';
import { transferFolio } from '../../controllers/Folio/transferFolio.js';
import { splitFolio } from '../../controllers/Folio/splitFolio.js';
import { voidFolio } from '../../controllers/Folio/voidFolio.js';
import {createFolio} from "../../controllers/Folio/createFolio.js";
import { settleFolio } from '../../controllers/Folio/settleFolio.js';
import { makeMasterFolio } from '../../controllers/Folio/makeMasterFilio.js';
import {closeFolio} from "../../controllers/Folio/closeFolio.js"
import { billingPreferences } from '../../controllers/Folio/billingPreferences.js';
import {uploadDetails} from "../../controllers/Folio/upload.js"


router.post("/api/addCharges",addCharges)

router.post("/api/addPayment",addPayment)

router.post("/api/addDiscount",addDiscount)

router.post("/api/addAdjustment",addAdjustment)

router.patch("/api/transferFolio",transferFolio)

router.patch("/api/splitFolio",splitFolio)

router.patch("/api/voidFolio",voidFolio)

router.post("/api/createFolio",createFolio)

router.patch("/api/settleFolio", settleFolio)

router.patch("/api/makeMasterFolio",makeMasterFolio)

router.patch("/api/closeFolio",closeFolio)

router.patch("/api/billingPreferences",billingPreferences)

router.patch("/api/uploadFile",upload.fields([{ name: 'doc', maxCount: 1 }]),uploadDetails)


export default router