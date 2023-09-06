const permissions_data = require("../../models/Permissions/permissions");
const randomstring = require("randomstring");
const user = require("../../models/Users/hotelOwnerRegister")

module.exports = async (req, res) => {
  try {
    const permissionName = req.body.permissionName.map((item) => {
      return {
        subPermissionId: randomstring.generate(5),
        subPermission: item.subPermission, // Assuming you want to keep the subPermission value from req.body
      };
    });

    const userRole = await user.findOne({userId:req.params.userId})

    const permissiondata = new permissions_data({
      permissionsId : randomstring.generate(10),
      addedBy : userRole.role,
      timestamp : new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      permissionTypeName: req.body.permissionTypeName,
      permissionName: permissionName,
    });

    const data = await permissiondata.save();

    if (data) {
      return res.status(200).json({ message: "Permission added successfully" });
    } else {
      return res.status(500).json({ message: "Something went wrong" });
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: "Bad Request" });
  }
};
