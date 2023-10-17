import * as dotenv from 'dotenv';
dotenv.config();
import randomstring from 'randomstring'
import userModel from '../../models/user.js'
import { jwtsign, getCurrentUTCTimestamp, encrypt } from "../../helpers/helper.js"
const postUser = async (req, res) => {
    try {

        const password = req.body.password

        const encryptedPass = encrypt(password);
        console.log(encryptedPass)

        const email = req.body.email

        const authTokenPayload = {
            email: email,
            password: password
        }
        const modifiedDate = await getCurrentUTCTimestamp()

        const encryptedCode = await jwtsign(authTokenPayload)
        const userId = randomstring.generate(8)
        const newData = new userModel({
            userId,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            designation: [{ designation: req.body.designation, modifiedDate: modifiedDate }],
            phoneNumber: [{ phoneNumber: req.body.phoneNumber, modifiedDate: modifiedDate }],
            email: email,
            password: [{ password: encryptedPass, modifiedDate: modifiedDate }],
            username: [{ username: req.body.username || 'Admin', modifiedDate: modifiedDate }],
            authCode: encryptedCode,
            role: [{
                role: req.body.role || 'Admin',
                modifiedDate: modifiedDate
            }],
            singlePropertyDetails: [{
                userId: userId
            }],
            multipleData: [{
                userId: userId
            }]

        })
        const userData=await newData.save()

        return res.status(200).json({ message: "User successfully added",userId:userData.userId,authcode:userData.authCode, statuscode: 200 })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 })
    }
}

export default postUser