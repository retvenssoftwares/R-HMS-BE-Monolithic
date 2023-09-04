const express = require('express');
const rateType = require('../../controllers/Rates/rateType');


const app = express.Router();


app.post('/rateType/:roomTypeId',rateType);



module.exports = app;
                                                                                                                                        