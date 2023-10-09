//import express for post route
const express = require('express');
const { Router } = require('express');
const propertyType = require('../../controllers/Property/getPropertyType');

const app = express.Router();

//define route
app.get('/propertyType', propertyType);

module.exports = app;
