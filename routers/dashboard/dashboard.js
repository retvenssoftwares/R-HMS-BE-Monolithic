import express from 'express';
const router = express.Router();

import GetRevenueByYear from "../../controllers/dashboard/fetchRevenueByEachYear.js"
import fetchRevenueByComparison from '../../controllers/dashboard/fetchRevenueByComparison.js'
import topSourcesData from '../../controllers/dashboard/fetchTopSources.js'

router.get("/api/getRevenue", GetRevenueByYear);
router.get("/api/fetchRevenueByComparison",fetchRevenueByComparison)
router.get("/api/getTopSources",topSourcesData)
export default router;