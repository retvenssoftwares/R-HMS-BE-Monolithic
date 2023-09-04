//import express for post route
const express = require('express');
//import property add controller
const propertyAddController = require('../../controllers/Property/addProperty');

const app = express.Router();

//define route
app.post('/addProperty/:userId', propertyAddController);

module.exports = app;
