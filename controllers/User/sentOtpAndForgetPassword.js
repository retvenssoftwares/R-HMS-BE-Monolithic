import Randomstring from "randomstring";
import { otpVerification, getCurrentUTCTimestamp, convertTimestampToCustomFormat, encrypt } from "../../helpers/helper.js";
import otpModel from "../../models/forgetPassword.js";
import verifiedUser from "../../models/verifiedUsers.js";
import user from "../../models/user.js"

export const forgetPassword = async (req, res) => {
    const { email, Otp, password , userId } = req.body;

    if(!email || !Otp || !password || !userId){
        return res.status(404).json({ message: "data not found", statusCode: 404 })
    }

    const userDetails = await user.findOne({userId : userId})

    if(!userDetails){
        return res.status(404).json({ message: "data not found", statusCode: 404 })
    }

    if (email) {
        const data = await verifiedUser.findOne({ email: email })
        if (!data) {
            return res.status(404).json({ message: "data not found", statusCode: 404 })
        }
        const OTP = Randomstring.generate({ charset: 'numeric', length: 6 });
        await verifiedUser.updateOne({ email: email }, { $set: { otp: OTP, time: await getCurrentUTCTimestamp() } })
        await otpVerification(email, OTP);
    }


    if (Otp) {
        const tenMinutesAgo = new Date(new Date().getTime() - 1 * 60 * 1000);
        const utcTimestamp = tenMinutesAgo.toISOString();

        const details = await verifiedUser.findOne({ otp: Otp, time: { $lte: utcTimestamp } })
        if (details) {
            await verifiedUser.updateMany({userId : userId} , {$set : {otp : "" , time : ""}})
            return res.status(200).json({ message: "your otp has expired", statusCode: 200 })
        } else {
            const details = await verifiedUser.findOne({ otp: Otp })

            if(!details){
                return res.status(404).json({ message: "Incorrect otp", statusCode: 404 })
            }
            
            if (Otp === details.otp) {
                const encryptedPass = encrypt(password);
                console.log(encryptedPass)
                await verifiedUser.updateOne(
                    { otp: Otp },
                    {
                        $push: {
                            password: {
                                $each: [{ password: encryptedPass }],
                                $position: 0,
                            },
                        },
                    }
                );

                await verifiedUser.updateMany({userId : userId} , {$set : {otp : "" , time : ""}})
            }
        }

    }
};
