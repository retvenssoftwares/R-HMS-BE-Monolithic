const express = require('express');
const multer = require('multer');
const upload = multer();
const roomType = require('../../controllers/Rooms/roomType');


const app = express.Router();


app.post('/roomType/:propertyId',upload.array('roomTypeImages'),roomType);



module.exports = app;
                                    