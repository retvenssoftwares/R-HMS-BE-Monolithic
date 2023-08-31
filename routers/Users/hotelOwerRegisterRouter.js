const express = require('express');
//const todoController = require('../controllers/profile');
const hotelAndEmployee = require('../../controllers/Users/hotelOwnerRegister')

const app = express.Router();

//app.get('/:userId', todoController.getTodoByUserId);
app.post('/postHotelAndEmployee', hotelAndEmployee);


module.exports = app;