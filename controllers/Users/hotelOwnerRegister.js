require("dotenv").config();
const moment = require("moment");
const hotelAndEmployee = require("../../models/Users/hotelOwnerRegister");
const apiname = require('../../models/Users/apiHittingArray')
const roleModel = require('../../models/Role/role')
const permissionsModel = require('../../models/Permissions/permissions');
const crypto = require("crypto");

const iv = process.env.iv;

exports.register = async (req, res) => {
  try {
    //const formattedTimestamp = moment().format("YYYY-MM-DD HH:mm:ss");
    const {
      fullName,
      userName,
      designation,
      email,
      role,
      password,
      propertyType,
      mobile,
      ipAddress,
      deviceTypename,
      location,
      permissions,
      osVersion,
      osType,
      hotelName,
      propertyAuthCode,
      hotelCount,
      deviceType
    } = req.body;
    

    const username = await hotelAndEmployee.findOne({ userName: userName })

    if (username) {
      return res.status(500).json({ message: "User name already exists" });
    }

    const genVariable = req.body.genVariable;

    const namePrefix = userName.slice(0, 4);
    const dobSuffix = mobile.slice(-4);

    // Create the variable by concatenating namePrefix and dobSuffix
    const generatedVariable = namePrefix + dobSuffix;

    // this is the key which will be used for encryption and decryption the password
    const key = process.env.key;

    function encrypt(text) {
      const cipher = crypto.createCipheriv(
        "aes-256-cbc",
        Buffer.from(key, "hex"),
        Buffer.from(iv)
      );
      let encrypted = cipher.update(text, "utf8", "hex");
      encrypted += cipher.final("hex");
      return encrypted;
    }


    // const findRole = await roleModel.findOne({roleId: req.body.roleId})
    // const {roleName} = findRole;
   
    if (genVariable === generatedVariable && (role === 'Admin' || role === 'admin')) {
      const encryptedPassword = encrypt(password);
      const adminPermissions = await permissionsModel.find({});


      const newpass = new hotelAndEmployee({
        fullName,
        userName,
        designation,
        email,
        role: 'Admin',
        password: { password: encryptedPassword },
        deviceType: { ipAddress, deviceTypename, location, osVersion, osType },
        propertyType,
        mobile,
        deviceType,
        propertyAuthCode,
        hotelName,
        hotelCount,
        permissions: adminPermissions,
        timeStamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      });

      // newpass.permissions.push(adminPermissions)
      await newpass.save();

      // await apiname.updateOne(
      //   { userId: userProfileId.userId },
      //   {
      //     $push: {
      //       apiArray: {
      //         $each: [
      //           {
      //             apiname: "Login",
      //             role : userProfileId.role,
      //             timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      //             ipAddress: ipAddress,
      //             deviceType: deviceType
      //           }
      //         ],
      //         $position: 0
      //       }
      //     }
      //   }
      // );


      return res.status(200).json({ message: "User Registered Successfully" });
    } else if (genVariable === generatedVariable) {
      const encryptedPassword = encrypt(password);

      const newpass = new hotelAndEmployee({
        fullName,
        userName,
        designation,
        email,
        role,
        password: { password: encryptedPassword },
        deviceType: { ipAddress, deviceTypename, location, osVersion, osType },
        propertyType,
        mobile,
        deviceType,
        propertyAuthCode,
        hotelName,
        hotelCount,
        permissions,
        timeStamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      });

      await newpass.save();
      return res.status(200).json({ message: "User Registered Successfully" });
    }
    else {
      res.status(500).json({ message: "enter valid details" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "Bad Request" });
  }
};



// session out api
exports.sessionOut = async (req, res) => {
  const hotelAndEmployee = require("../../models/Users/hotelOwnerRegister");
  const apiname = require('../../models/Users/apiHittingArray')
  const crypto = require("crypto");

  try {
    const { userId } = req.params;
    const propertyId = req.body.propertyId;
    const { ipAddress,
      deviceType } = req.body;
    const data = await hotelAndEmployee.findOne({ userId });

    const registrationId = "";
    await hotelAndEmployee.updateOne(
      { _id: data._id },
      { $set: { registrationId: registrationId } }
    );


    // api hitting details

    await apiname.updateOne(
      { propertyId: propertyId },
      {
        $push: {
          apiArray: {
            $each: [
              {
                apiname: "SessionOut",
                role: data.role,
                timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
                ipAddress: ipAddress,
                userId: userId,
                deviceType: deviceType
              }
            ],
            $position: 0
          }
        }
      }
    );

    return res.status(200).json({ message: "Your session timed out" });


  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



//session In
exports.sessionIn = async (req, res) => {
  const hotelAndEmployee = require("../../models/Users/hotelOwnerRegister");
  const propertyModel = require('../../models/Property/propertySetupModel')
  const apiname = require('../../models/Users/apiHittingArray')
  const crypto = require("crypto");

  try {
    const password = req.body.password;

    const { userId } = req.params;
    // const userProperty = await propertyModel.findOne({userId})
    const propertyId = req.body.propertyId
    const { ipAddress,
      deviceType } = req.body;
    const data = await hotelAndEmployee.findOne({ userId });
    const key = process.env.key;

    const iv = process.env.iv;

    function decrypt(encryptedText) {
      const decipher = crypto.createDecipheriv(
        "aes-256-cbc",
        Buffer.from(key, "hex"),
        Buffer.from(iv)
      );
      let decrypted = decipher.update(encryptedText, "hex", "utf8");
      decrypted += decipher.final("utf8");
      return decrypted;
    }

    const original = decrypt(data.password[0].password);


    if (original === password) {

      // api hitting details
      await apiname.updateOne(
        { propertyId: propertyId },
        {
          $push: {
            apiArray: {
              $each: [
                {
                  apiname: "SessionIn",
                  role: data.role,
                  timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
                  ipAddress: ipAddress,
                  userId: userId,
                  deviceType: deviceType
                }
              ],
              $position: 0
            }
          }
        }
      );

      const registrationId = crypto.randomBytes(64).toString("hex");
      await hotelAndEmployee.updateOne({ _id: data._id }, { $set: { registrationId: registrationId } });

      return res.status(200).json({ message: "Please log in again" });
    } else {
      return res.status(401).json({ message: "Enter valid credentials" });
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
