const express = require('express');
const multer = require('multer');
const upload = multer();
const getBasicCurrencies = require('../../controllers/Rates/getBasicCurrencies');


const app = express.Router();


app.post('/ratePlan/:roomTypeId',upload.single('photo'),ratePlan);



module.exports = app;
                                                                                                                                        