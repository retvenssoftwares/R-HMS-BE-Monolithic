import express from 'express';
const router = express.Router();

import GetRevenueByYear from "../../controllers/dashboard/fetchRevenueByEachYear.js"
import fetchRevenueByComparison from '../../controllers/dashboard/fetchRevenueByComparison.js'

router.get("/api/getRevenue", GetRevenueByYear);
router.get("/api/fetchRevenueByComparison",fetchRevenueByComparison)
export default router;