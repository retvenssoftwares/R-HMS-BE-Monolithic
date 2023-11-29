import crypto from 'crypto'
import { decrypt } from '../../helpers/helper.js'
import userModel from '../../models/verifiedUsers.js'
//import porperty from '../../models/property.js'

const userLogin = async (req, res) => {
    try {
        const { username, hotelCode, password, deviceType } = req.body;

        //get required fields
        if (!username && !hotelCode && !password) {
            return res.status(400).json({ message: "username, hotelcode, password are required", statuscode: 400 })
        }
        const findProfile = await userModel.findOne({ "hotelCode.hotelCode": hotelCode });

        if (!findProfile) {
            return res.status(404).json({ message: "invalid hotelcode", statuscode: 404 })
        }
        const findPassword = findProfile.password[0].password
        const findUsername = findProfile.username[0].username
       const isLogin = findProfile.isLogin
       const findDesignation =findProfile.designation[0].designation
       const findFirstName =findProfile.firstName
       const findLastName = findProfile.lastName
       const propertyTypeSOC = findProfile.propertyTypeSOC
    
        const decryptedPass = decrypt(findPassword)
        console.log(decryptedPass)
        // if(propertyTypeSOC==="Single"){
        //     const 
        // }
        //add fields validation
        if (username !== findUsername || password !== decryptedPass) {
            return res.status(400).json({ message: "Invalid credentials", statuscode: 400 })
        } else {
            let authObj = {
                token: crypto.randomBytes(64).toString("hex"),
                deviceType: deviceType
            }
            findProfile.token.unshift(authObj)
            await findProfile.save()
            return res.status(200).json({ message: "Login successful", statuscode: 200, data: { userId: findProfile.userId,isLogin:isLogin,designation:findDesignation,firstName:findFirstName,lastName:findLastName, token: authObj.token }})
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 })
    }

}

export default userLogin



