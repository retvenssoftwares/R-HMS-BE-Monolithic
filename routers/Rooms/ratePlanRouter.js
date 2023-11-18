import express from 'express';
import ratePlan from "../../controllers/Rooms/ratePlan.js"
import createDiscountPlan from '../../controllers/Rooms/createDiscountPlan.js';
import editDiscountPlan from "../../controllers/Rooms/patchDiscountPlan.js";
import getCompanyRatePlans from '../../controllers/Rooms/getCompanyRatePlans.js';
import getRatePlansList from '../../controllers/Rooms/getRatePlansList.js';
import getBarRatePlanById from '../../controllers/Rooms/getBarRatePlanById.js';
import getRatePlansListWithRooms from '../../controllers/Rooms/getRoomsWithPlans.js';
import discountPlanGet from '../../controllers/Rooms/getDiscountRatePlanById.js';
import getAllDiscountPlans from '../../controllers/Rooms/getAllDiscountPlans.js';
import getCompanyRatePlanViaRoomTypeId from "../../controllers/Rooms/getCompanyRatePlanViaRoomTypeId.js"
const router = express.Router();

router.post("/api/ratePlan", ratePlan);
router.post("/api/addDiscountPlan", createDiscountPlan);
router.patch("/api/editDiscountPlan", editDiscountPlan);
router.get("/api/getDiscountPlanById", discountPlanGet);
router.get("/api/getCompanyPlans", getCompanyRatePlans);
router.get("/api/getRatePlansList", getRatePlansList);
router.get("/api/getBarPlanById", getBarRatePlanById);
router.get("/api/getRoomsWithPlans", getRatePlansListWithRooms);
router.get("/api/getAllDiscountPlans", getAllDiscountPlans);
router.get("/api/getCompanyRatePlanViaRoomTypeId", getCompanyRatePlanViaRoomTypeId);
export default router;