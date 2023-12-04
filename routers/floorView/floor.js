import express from 'express';
const router = express.Router();

//
import { addRoomInfloor } from '../../controllers/floorView/floor.js';
import fetchfloorDetails from "../../controllers/floorView/getFloorDetails.js"
import { getRoomByFloorId } from "../../controllers/floorView/getRoomByFloorId.js"
import { roomDetails } from '../../controllers/floorView/roomInFloor.js';

//
router.post("/api/addFloor", addRoomInfloor)
router.get("/api/getFloorDetails", fetchfloorDetails)
router.get("/api/getRoomDetailsByFloorId", getRoomByFloorId)
router.patch("/api/addRoomInFloor", roomDetails)

export default router;