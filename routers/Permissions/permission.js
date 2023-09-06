const express = require('express');
const permission = require('../../controllers/Permission/permission');
const app = express.Router();
app.post('/userPermission',permission);
module.exports = app;