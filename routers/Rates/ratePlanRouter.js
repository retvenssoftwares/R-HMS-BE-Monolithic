const express = require('express');
const multer = require('multer');
const upload = multer();
const ratePlan = require('../../controllers/Rates/ratePlan');


const app = express.Router();


app.post('/ratePlan/:roomTypeId',upload.single('photo'),ratePlan);



module.exports = app;
                                                                                                                                        