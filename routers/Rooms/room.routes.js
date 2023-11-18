import express from 'express';
// const multer = require('multer');
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
import postRoom from '../../controllers/Rooms/addRoom.controller.js'
import patchRoom from '../../controllers/Rooms/updateRoomDetails.controller.js'
import fetchRoom from '../../controllers/Rooms/getRoom.controller.js'
import getRoomByRoomType from '../../controllers/Rooms/fetchRoomByRoomTypeId.js'
import uploadRoomImage from '../../controllers/Rooms/uploadRoomImage.controller.js'
import updateRoomImage from '../../controllers/Rooms/updateRoomImage.controller.js'
import changeIndex from '../../controllers/Rooms/uploadPatchRoomImage.controller.js'
import inclusion from '../../controllers/Rooms/postInclusion.controller.js';
import getInclusion from '../../controllers/Rooms/getInclusion.js';
import patchInclusions from '../../controllers/Rooms/patchInclusion.js';

import { companyRatePlan, updateCompanyRatePlan } from '../../controllers/Rooms/companyRatePlan.js';
import BarRatePlan from '../../controllers/Rooms/postBarRatePlan.controller.js'
import fetchBarRatePlan from '../../controllers/Rooms/getBarRatePlan.js'
import updateBarRatePlan from '../../controllers/Rooms/patchBarRatePlan.controller.js'
import getFloors from '../../controllers/Rooms/getPropertyFloors.js';
import { packageRatePlan, updatePackageRatePlan } from '../../controllers/Rooms/package.js';
import companyRatePlans from '../../controllers/Rooms/getCompanyRatePlan.js';

//check room availabilty
import getRoom from '../../controllers/Rooms/getRoomsList.js';

const router = express.Router();

//addroom
router.post('/api/createRoom', postRoom);

//
router.get('/api/fetchRoom',getRoomByRoomType)

//update Room
router.patch('/api/updateRoom/:roomTypeId', patchRoom)

//getRoom
router.get('/api/getRoom', fetchRoom);

//Update roomImage
router.patch('/api/patchRoomImage', updateRoomImage)

//changeRoomIndex
router.patch('/api/changeIndex/:roomTypeId', changeIndex)

//upload room image
router.patch(
    '/api/uploadRoomImage/:roomTypeId',
    upload.fields([{ name: 'roomImage', maxCount: 1 }]),
    uploadRoomImage
);

//post inclusion
router.post('/api/postInclusion', inclusion)

//get inclusion
router.get('/api/getInclusion',getInclusion )

//patch inclusion
router.patch('/api/patchInclusion', patchInclusions)

//company rate plan
router.post("/api/addCompanyRatePlan", companyRatePlan)

//update companyRtePlan
router.patch("/api/updateCompanyRatePlan", updateCompanyRatePlan)

//get companyRatePlan
router.get('/api/getCompanyRatePlans', companyRatePlans)

//post BarRatePlan
router.post('/api/barRatePlan', BarRatePlan)

//update barRatePlan
router.patch('/api/updateBarRatePlan/:barRatePlanId', updateBarRatePlan)

//get barRatePlan
router.get('/api/getBarRatePlans',fetchBarRatePlan)

//add package 
router.post("/api/addPackage", packageRatePlan)

//update PackageRatePlan
router.patch("/api/updatePackageRatePlan", updatePackageRatePlan)

//floors
router.get("/api/getPropertyFloors", getFloors)

router.get("/api/getRoomList",getRoom);

export default router;