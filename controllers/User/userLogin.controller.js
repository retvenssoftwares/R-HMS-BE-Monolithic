
import { decrypt } from '../../helpers/helper.js'
import userModel from '../../models/user.js'

const userLogin = async (req, res) => {
    try {
        const { username, hotelRcode, password } = req.body;
        const authCodeValue = req.headers['authcode']

        //get required fields
        if (!username && !hotelRcode && !password && !authCodeValue) {
            return res.status(400).json({ message: "username, hotelRcode, password and authCode are required", statuscode: 400 })
        }
        const findProfile = await userModel.findOne({ hotelRcode });

        if (!findProfile) {
            return res.status(404).json({ message: "Profile not found", statuscode: 400 })
        }
        const findPassword = findProfile.password[0].password
        const findUsername = findProfile.username[0].username
        const findRCode = findProfile.hotelRcode
        const findAuthCode = findProfile.authCode;
        const decryptedPass = decrypt(findPassword)        

        //add fields validation
        if (username !== findUsername || hotelRcode !== findRCode || password !== decryptedPass || findAuthCode !== authCodeValue) {
            return res.status(400).json({ message: "Invalid credentials", statuscode: 400 })
        } else {
            return res.status(200).json({ message: "Login successful", statuscode: 200 })
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 })
    }

}

export default userLogin