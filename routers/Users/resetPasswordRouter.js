const express = require('express');
//const todoController = require('../controllers/profile');
const resetpass = require('../../controllers/Users/resetPassword')

const app = express.Router();

//app.get('/:userId', todoController.getTodoByUserId);
app.post('/forget-password', resetpass.forgetpassword);
app.get('/reset',resetpass.resetPassword)
// app.patch('/sessionIn/:userId',hotelAndEmployee.sessionIn)


module.exports = app;