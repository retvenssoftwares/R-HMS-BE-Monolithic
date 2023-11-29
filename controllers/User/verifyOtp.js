import Randomstring from "randomstring";
import { otpVerification, getCurrentUTCTimestamp, convertTimestampToCustomFormat, encrypt, sendEmail } from "../../helpers/helper.js";
import verifiedUser from "../../models/verifiedUsers.js";
import user from "../../models/user.js"


export const verifyOtp = async(req,res)=>{
    const { Otp} = req.body

    if (!Otp) {
        return res.status(400).json({ message: "otp is missing", statusCode: 400 })
    }

    if (Otp) {
        const tenMinutesAgo = new Date(new Date().getTime() - 5 * 60 * 1000);
        const utcTimestamp = tenMinutesAgo.toISOString();
        const details = await verifiedUser.findOne({ otp: Otp, time: { $lte: utcTimestamp } })
        if (details) {
            await verifiedUser.updateOne({ otp: Otp }, { $set: { otp: "", time: "" } })
            return res.status(200).json({ message: "your otp has expired", statusCode: 200 })
        } else {
            const details = await verifiedUser.findOne({ otp: Otp })

            if (!details) {
                return res.status(400).json({ message: "Incorrect otp", statusCode: 400 })
            }

            return res.status(200).json({ message: "otp verified successfully", statusCode: 200 });


        }

    }
}