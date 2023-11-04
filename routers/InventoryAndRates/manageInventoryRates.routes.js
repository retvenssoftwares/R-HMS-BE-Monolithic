import express from 'express';
const router = express.Router();
import manageInventory from '../../controllers/InventoryAndRates/manageInventory.js'
import manageRatesRestrictions from '../../controllers/InventoryAndRates/manageRatesAndRestrictions.js'
import getInventory from '../../controllers/InventoryAndRates/getInventory.js';
import manageRestrictions from '../../controllers/InventoryAndRates/manageRestrictions.js';

router.patch("/api/updateInventory", manageInventory)
router.patch("/api/updateRates", manageRatesRestrictions)
router.patch("/api/updateRestrictions", manageRestrictions)
router.get("/api/getInventory", getInventory)
export default router;