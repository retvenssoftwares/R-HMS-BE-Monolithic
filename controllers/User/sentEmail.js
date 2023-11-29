import Randomstring from "randomstring";
import { otpVerification, getCurrentUTCTimestamp, convertTimestampToCustomFormat, encrypt, sendEmail } from "../../helpers/helper.js";
import verifiedUser from "../../models/verifiedUsers.js";
import user from "../../models/user.js"

export const sendOtp = async(req,res)=>{
    const email = req.body.email

    const userDetails = await verifiedUser.findOne({email : email})

    if (!userDetails) {
        return res.status(404).json({ message: "data not found", statusCode: 404 })
    }
    const OTP = Randomstring.generate({ charset: 'numeric', length: 6 });
    await verifiedUser.updateOne({ email: email }, { $set: { otp: OTP, time: await getCurrentUTCTimestamp() } })
    await otpVerification(email, OTP);

    return res.status(200).json({ message: `Otp sent on your email ${email}`, statusCode: 200 })
}

