import express from 'express';
const router = express.Router();

import GetRevenueByYear from "../../controllers/dashboard/fetchRevenueByEachYear.js"


router.get("/api/getRevenue", GetRevenueByYear);
export default router;