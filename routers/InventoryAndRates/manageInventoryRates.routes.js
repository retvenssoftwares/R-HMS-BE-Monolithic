import express from 'express';
const router = express.Router();
import { Server } from 'socket.io';
import manageInventory from '../../controllers/InventoryAndRates/manageInventory.js'
import manageRates from '../../controllers/InventoryAndRates/manageRatesAndRestrictions.js'
import getInventory from '../../controllers/InventoryAndRates/getInventory.js';
import manageRestrictions from '../../controllers/InventoryAndRates/manageRestrictions.js';
import { io } from '../../server.js'

router.patch("/api/updateInventory", (req, res) => manageInventory(req, res, io));
router.patch("/api/updateRates", (req, res) => manageRates(req, res, io));
router.patch("/api/updateRestrictions", (req, res) => manageRestrictions(req, res, io));
router.get("/api/getInventory", getInventory)
export default router;