require('dotenv').config()
const express = require('express');

//const path = require('path')
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

 require("./db/conn");

 //user routers
 const userLoginRouter = require('./routers/Users/userLoginRouter')
 app.use(userLoginRouter)

 //property routers
 const propertyAdd = require('./routers/Property/addPropertyRouter')
 app.use(propertyAdd)

 // Middleware to set custom headers
app.use((req, res, next) => {
  // Set custom headers
  res.setHeader('X-App-Version', '1.0.0');
  
  // Call next middleware
  next();
});


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