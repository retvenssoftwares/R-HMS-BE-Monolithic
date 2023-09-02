const express = require('express');
//const todoController = require('../controllers/profile');
const hotelAndEmployee = require('../../controllers/Users/hotelOwnerRegister')

const app = express.Router();

//app.get('/:userId', todoController.getTodoByUserId);
app.post('/postHotelAndEmployee', hotelAndEmployee.register);
app.patch('/sessionOut/:userId',hotelAndEmployee.sessionOut)
app.patch('/sessionIn/:userId',hotelAndEmployee.sessionIn)



module.exports = app;