import express from 'express';
import ratePlan from "../../controllers/Rooms/ratePlan.js"
import createDiscountPlan from '../../controllers/Rooms/createDiscountPlan.js';
import editDiscountPlan from "../../controllers/Rooms/patchDiscountPlan.js";
import getCompanyRatePlans from '../../controllers/Rooms/getCompanyRatePlans.js';
import getRatePlansList from '../../controllers/Rooms/getRatePlansList.js'
import getCompanyRatePlanViaRoomTypeId from "../../controllers/Rooms/getCompanyRatePlanViaRoomTypeId.js"
const router = express.Router();

router.post("/api/ratePlan", ratePlan);
router.post("/api/addDiscountPlan", createDiscountPlan);
router.patch("/api/editDiscountPlan", editDiscountPlan);
router.get("/api/getCompanyPlans", getCompanyRatePlans);
router.get("/api/getRatePlansList", getRatePlansList);
router.get("/api/getCompanyRatePlanViaRoomTypeId", getCompanyRatePlanViaRoomTypeId);
export default router;