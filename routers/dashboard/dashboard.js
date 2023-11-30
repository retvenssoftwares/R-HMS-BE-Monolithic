import express from 'express';
const router = express.Router();

import GetRevenueByYear from "../../controllers/dashboard/fetchRevenueByEachYear.js"
import fetchRevenueByComparison from '../../controllers/dashboard/fetchRevenueByComparison.js'
import topSourcesData from '../../controllers/dashboard/fetchTopSources.js'
import bestSeller from '../../controllers/dashboard/fetchBestSeller.js'

router.get("/api/getRevenue", GetRevenueByYear);
router.get("/api/fetchRevenueByComparison",fetchRevenueByComparison)
router.get("/api/getTopSources",topSourcesData)
router.get("/api/fetchRoomTypeData",bestSeller)
export default router;
