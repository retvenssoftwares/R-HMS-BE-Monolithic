import Randomstring from "randomstring";
import { otpVerification, getCurrentUTCTimestamp, convertTimestampToCustomFormat, encrypt, sendEmail } from "../../helpers/helper.js";
import verifiedUser from "../../models/verifiedUsers.js";
import user from "../../models/user.js"


export const resetPassword = async(req,res)=>{

    const {email, password, confirmPassword } = req.body

    if (!password || !confirmPassword) {
        return res.status(400).json({ message: "Enter password first", statusCode: 400 });
    }
    if (password === confirmPassword) {
        const encryptedPass = encrypt(password);
        //console.log(encryptedPass)
        const updatedPassword = await verifiedUser.updateOne(
            { email: email },
            {
                $push: {
                    password: {
                        $each: [{ password: encryptedPass }],
                        $position: 0,
                    },
                },
            }
        );

        if (updatedPassword) {
            await verifiedUser.updateOne({ email: email }, { $set: { otp: "", time: "" } })
        }

        return res.status(200).json({ message: "password updated successfully", statusCode: 200 })

    }

}