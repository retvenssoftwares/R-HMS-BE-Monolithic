import express from 'express';
const router = express.Router();

import manageInventory from '../../controllers/InventoryAndRates/manageInventory.js'
import manageRatesRestrictions from '../../controllers/InventoryAndRates/manageRatesAndRestrictions.js'

router.patch("/api/updateInventory", manageInventory)
router.patch("/api/updateRatesRestrictions", manageRatesRestrictions)
export default router;