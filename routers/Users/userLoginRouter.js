const express = require('express');
const userLoginController = require('../../controllers/Users/userLogin');


const app = express.Router();


app.post('/userLogin/:userId', userLoginController.userLogin);
app.post('/userLogout/:userId', userLoginController.userLogout);


module.exports = app;
                                                                                                                                        