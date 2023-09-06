const express = require('express');
const role = require('../../controllers/Role/role');
const app = express.Router();
app.post('/userRole',role.addRoleName)
app.post('/userRoleAndPermission',role.addpermissionToRole);
module.exports = app;