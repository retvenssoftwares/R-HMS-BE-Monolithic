import express from 'express';
// const multer = require('multer');
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
import postRoom from '../../controllers/Rooms/addRoom.controller.js'
import fetchRoom from '../../controllers/Rooms/getRoom.controller.js'
import uploadRoomImage from '../../controllers/Rooms/uploadRoomImage.controller.js'
import updateRoomImage from '../../controllers/Rooms/updateRoomImage.controller.js'
import changeIndex from '../../controllers/Rooms/uploadPatchRoomImage.controller.js'
import inclusion from '../../controllers/Rooms/postInclusion.controller.js';
import BarRatePlan from '../../controllers/Rooms/postBarRatePlan.controller.js'
const router = express.Router();

//addroom
router.post('/api/createRoom',postRoom);

//getRoom
router.get('/api/getRoom',fetchRoom);

//Update roomImage
router.patch('/api/patchRoomImage',updateRoomImage)

//changeRoomIndex
router.patch('/api/changeIndex/:roomTypeId',changeIndex)

//upload room image
router.patch(
    '/api/uploadRoomImage/:roomTypeId',
    upload.fields([{ name: 'roomImage', maxCount: 1 }, { name: 'viewImage', maxCount: 1 }, { name: 'bathRoomImage', maxCount: 1 }, { name: 'bedImage', maxCount: 1 }]),
    uploadRoomImage
);

//post inclusion
router.post('/api/postInclusion',inclusion)

//post BarRatePlan
router.post('/api/barRatePlan',BarRatePlan)

export default router;