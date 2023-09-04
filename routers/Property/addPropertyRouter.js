//import express for post route
const express = require('express');
const multer = require('multer');
const { Router } = require('express');
const upload = multer();
//import property add controller
const propertyAddController = require('../../controllers/Property/addProperty');

const app = express.Router();

//define route
app.post('/addProperty/:userId', propertyAddController);

module.exports = app;
