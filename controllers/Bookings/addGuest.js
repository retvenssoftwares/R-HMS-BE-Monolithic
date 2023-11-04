import randomstring from 'randomstring'
import addguest from '../../models/guestDetails.js'
import { getCurrentUTCTimestamp, encrypt } from "../../helpers/helper.js"
const addUser = async (req, res) => {
    try {

        const password = req.body.password

        const encryptedPass = encrypt(password);
        // console.log(encryptedPass)

        const email = req.body.email

     
        const modifiedDate = await getCurrentUTCTimestamp()

        
        const userId = randomstring.generate(8)
        const newData = new addguest({
            userId,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            designation: [{ designation: req.body.designation, modifiedDate: modifiedDate }],
            phoneNumber: [{ phoneNumber: req.body.phoneNumber, modifiedDate: modifiedDate }],
            email: email,
            password: [{ password: encryptedPass, modifiedDate: modifiedDate }],
            username: [{ username: req.body.username || 'Admin', modifiedDate: modifiedDate }],
            role: [{
                role: req.body.role || 'Admin',
                modifiedDate: modifiedDate
            }],
            singlePropertyDetails: [{
                userId: userId
            }],
            multipleData: [{
                userId: userId
            }],
            propertyName: [{
                propertyName: ''
            }]
        })
        const userData = await newData.save()

        return res.status(200).json({ message: "User successfully added", userId: userData.userId, authcode: userData.authCode, statuscode: 200 })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 })
    }
}

export default addUser