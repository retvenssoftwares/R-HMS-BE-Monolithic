import crypto from 'crypto'
import { decrypt } from '../../helpers/helper.js'
import userModel from '../../models/verifiedUsers.js'
import propertyModel from '../../models/property.js'

const adminLogin = async (req, res) => {
    try {
        const { username, hotelRcode, password, deviceType } = req.body;

        //get required fields
        if (!username && !hotelRcode && !password) {
            return res.status(400).json({ message: "username, hotelRcode, password are required", statuscode: 400 })
        }
        const findProfile = await userModel.findOne({ hotelRcode: hotelRcode });

        if (!findProfile) {
            return res.status(404).json({ message: "invalid hotelRcode", statuscode: 404 })
        }
        const findPassword = findProfile.password[0].password
        const findUsername = findProfile.username[0].username
        const findCode = findProfile.hotelCode
     
        const hotelCodes = findCode.map(item => item.hotelCode);
       //console.log(hotelCodes);

        const decryptedPass = decrypt(findPassword)

        ///add fields validation
        if (username !== findUsername  || password !== decryptedPass) {
            return res.status(400).json({ message: "Invalid credentials", statuscode: 400 })
        } else {
            let authObj = {
                token: crypto.randomBytes(64).toString("hex"),
                deviceType: deviceType
            }
            findProfile.token.unshift(authObj)
            await findProfile.save()

            ///destruture propertyId propertyName
            const propertyDetails = await propertyModel.find({ propertyId: hotelCodes });
            const propertyData = propertyDetails.map(property => {
                return {
                    propertyId: property.propertyId,
                    propertyName: property.propertyName[0].propertyName || '',
                   // hotelLogo: property.hotelLogo[0].hotelLogo || '' // Assuming hotelLogo is stored in an array as well
                  
                };
            });

            return res.status(200).json({ message: "Login successful", statuscode: 200, data: { userId: findProfile.userId,propertyData: propertyData, token: authObj.token }})
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 })
    }

}

export default adminLogin;