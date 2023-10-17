import express from 'express';
// const multer = require('multer');
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
import postProperty from '../../controllers/Property/property.controller.js'
//import postPropertyChain from "../../controllers/Property/propertyChain.controller.js"
import editProperty from "../../controllers/Property/editPropert.controller.js"

import userProperty from "../../controllers/Property/getUserProperties.controller.js"

import userIdentity from "../../controllers/Property/postidentity.controller.js"

const router = express.Router();

router.post(
    '/api/createProperty',
    upload.fields([{ name: 'hotelImages', maxCount: 10 }, { name: 'hotelLogo', maxCount: 1 }]),
    postProperty
);
//router.post("/api/createPropertyChain", upload.single('hotelLogo'), postPropertyChain);
router.patch("/api/editProperty",editProperty);

router.get("/api/fetchProperty/:userId",userProperty);

router.post("/api/postIdentity", userIdentity);

export default router;