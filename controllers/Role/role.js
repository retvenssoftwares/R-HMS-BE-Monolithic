const mongoose = require("mongoose");
const randomstring = require("randomstring");
const permissionRoleSchema = require("../../models/Role/permissionRole"); // Import the role schema
const permissionsSchema = require("../../models/Permissions/permissions"); // Import the permissions schema
const  role = require('../../models/Role/role')

exports.addRoleName = async (req,res) =>{
  try {
    
    const data = new role({
      roleId : randomstring.generate(10),
      roleName : req.body.roleName
    })

    await data.save()
    res.status(200).json({message:"role added sussceefully"})

  }catch{
    res.status(500).json({message : error})
  }
}



exports.addpermissionToRole = async (req, res) => {
  try {
    const { roleId, selectedSubPermissionsId } = req.body;

    // Find the permissions data for the selected subPermissions
    const permissionsData = await permissionsSchema.find({
      'permissionName.subPermissionId': { $in: selectedSubPermissionsId }
    });

    const rolename = await role.findOne({roleId:roleId})
    const {roleName} = rolename

    // Create a new role object with roleName and selected permissions array
    const roledata = new permissionRoleSchema({
      roleName:roleName,
      permissions: selectedSubPermissionsId.map((subPermissionId) => {
        const permission = permissionsData.find((permission) => permission.permissionName.some((sub) => sub.subPermissionId === subPermissionId));
        return {
          subPermissionId,
          subPermission: permission ? permission.permissionName.find((sub) => sub.subPermissionId === subPermissionId).subPermission : "",
        };
      }),
    });

    console.log(roledata)


    await roledata.save();

    return res.status(200).json({ message: "Role added successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "Bad Request" });
  }
};
