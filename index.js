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

// hotel and employee router
app.use(hotelEmployeeRouter)

app.get('/', (req, res) => {
    res.send('Welcome to Chatverse backend');
    res.sendStatus(200)
  })

  
const PORT = process.env.PORT || 3000;
app.listen(PORT,() =>{
    console.log(`connnection is setup at ${PORT}`);
 });