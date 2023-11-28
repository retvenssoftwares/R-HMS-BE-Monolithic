import Randomstring from "randomstring";
import { otpVerification, getCurrentUTCTimestamp, convertTimestampToCustomFormat, encrypt } from "../../helpers/helper.js";
import otpModel from "../../models/forgetPassword.js";
import verifiedUser from "../../models/verifiedUsers.js";
import user from "../../models/user.js"


let count = 0
export const forgetPassword = async (req, res) => {
    const { email} = req.body;
    if (email && count === 0) {
        const data = await verifiedUser.findOne({ email: email })
        count +=1
        if (!data) {
            return res.status(404).json({ message: "data not found", statuscode: 404 })
        }
        const OTP = Randomstring.generate({ charset: 'numeric', length: 6 });
        await verifiedUser.updateOne({ email: email }, { $set: { otp: OTP, time: await getCurrentUTCTimestamp() } })
        await otpVerification(email, OTP);

        return res.status(200).json({ message: `Otp sent on your email ${email}`, statuscode: 200 })
    } else {

        const { Otp, password, confirmPassword } = req.body
        // if (!Otp) {
        //     return res.status(404).json({ message: "some filelds is missing", statuscode: 404 })
        // }
        if (Otp) {
            const tenMinutesAgo = new Date(new Date().getTime() - 5 * 60 * 1000);
            const utcTimestamp = tenMinutesAgo.toISOString();
            const details = await verifiedUser.findOne({ otp: Otp, time: { $lte: utcTimestamp } })
            if (details) {
                await verifiedUser.updateOne({ otp: Otp }, { $set: { otp: "", time: "" } })
                count = 0
                return res.status(200).json({ message: "your otp has expired", statuscode: 200 })
            } else {
                const details = await verifiedUser.findOne({ otp: Otp })

                if (!details) {
                    return res.status(400).json({ message: "Incorrect otp", statuscode: 400 })
                }

                return res.status(200).json({ message: "otp verified successfully", statuscode: 200 });


            }

        } else {
            if (!password || !confirmPassword) {
                return res.status(400).json({ message: "Enter password first", statuscode: 400 });
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

                count = 0

                return res.status(200).json({ message: "password updated successfully", statuscode: 200 })


            } else {
                return res.status(400).json({ message: "password not matched", statuscode: 400 });
            }
        }



    }
}