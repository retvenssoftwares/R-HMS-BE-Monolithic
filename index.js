require('dotenv').config()
const express = require('express');

//const path = require('path')
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require("./db/conn");

// hotel and employee router
const hotelEmployeeRouter = require('../R-HMS-BE-Monolithic/routers/Users/hotelOwerRegisterRouter')
const resetPassword = require('../R-HMS-BE-Monolithic/routers/Users/resetPasswordRouter')


//user routers
const userLoginRouter = require('./routers/Users/userLoginRouter')

//property routers
const propertyAdd = require('./routers/Property/addPropertyRouter')


// hotel and employee router middleware
app.use(hotelEmployeeRouter)
app.use(resetPassword)

// user routers  middleware
app.use(userLoginRouter)

//property routers middleware
app.use(propertyAdd)

// Middleware to set custom headers
app.use((req, res, next) => {
  // Set custom headers
  res.setHeader('X-App-Version', '1.0.0');
  
  // Call next middleware
  next();
});

// testing server
app.get('/', (req, res) => {
  // const authHeader = req.headers['authheader']; 
  // if (!authHeader) {
  //   return res.status(400).json({ message: 'Please provide the authentication header' });
  // }
    res.send('Welcome to HMS backend');
    res.sendStatus(200)
  })



const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, function(){
  console.log("App is listening on: ", PORT);
}); 

module.exports = server;
