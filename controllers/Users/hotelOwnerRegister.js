require("dotenv").config();
const randomstring = require("randomstring")
const hotelAndEmployee = require("../../models/Users/hotelOwnerRegister");
//const apiname = require("../model/apiHitting");
const crypto = require("crypto");


const iv = process.env.iv
//const iv = "16digitivexample"
module.exports = async (req, res) => {
  try {
    // const { username, name, password, dob } = req.body;

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
      deviceType,
      osVersion,
      osType,
      hotelName,
      hotelCount,
      timeStamp,
    } = req.body;

    //await hotelEmployeeData.save()

    const genVariable = req.body.genVariable;

    const namePrefix = fullName.slice(0, 4);
    const dobSuffix = mobile.slice(-4);

    // Create the variable by concatenating namePrefix and dobSuffix
    const generatedVariable = namePrefix + dobSuffix;

    // this is the key which will be used for encryption and decryption the password
    const key = process.env.key;

    // function encrypt(text) {
    //   if (typeof text !== "string") {
    //     // If the text is not a string, convert it to a JSON string
    //     text = JSON.stringify(text);
    //   }
    //   const iv = crypto.randomBytes(IV_LENGTH);
    //   const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);
    //   let encrypted = cipher.update(text, "utf-8", "hex");
    //   encrypted += cipher.final("hex");
    //   return iv.toString("hex") + ":" + encrypted;
    // }

    function encrypt(text) {
        const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), Buffer.from(iv));
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
      }

      

    if (genVariable === generatedVariable) {
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
        hotelName,
        hotelCount,
        timeStamp,
      });

      await newpass.save();
     

      // Save the new Todo document

      //   const data = await Todo.findOne({ username });

      //   const api = new apiname({
      //     userId: data.userId,
      //     apiArray: [
      //       {
      //         timestamp: data.createdAt,
      //         apiname: "User_Registration",
      //       },
      //     ],
      //   });

      //   await api.save();

      res.status(201).json({ message: "User  Register Successfully" });
    }else{
        res.status(500).json({message : "enter valid details"})
    }
    // Extract the first 4 letters of the name and the last 4 letters of the dob
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Bad Request" });
  }
};
