import Randomstring from "randomstring"
import guestTypeModel from "../../models/guestType.js";
import {
    getCurrentUTCTimestamp,
    findUserByUserIdAndToken,
} from "../../helpers/helper.js";
import userModel from '../../models/verifiedUsers.js';

const updateGuestType = async (req, res) => {
    try {
        const { userId, guestId } = req.query;
        const { guestTypeName, shortCode, displayStatus } = req.body;
        const authCodeValue = req.headers['authcode'];

        const result = await findUserByUserIdAndToken(userId, authCodeValue)
        const findUser = await userModel.findOne({ userId: userId });

        if (!findUser) {
            return res.status(404).json({ message: "User not found or invalid userId", statuscode: 404 });
        }

        if (result.success) {
            const userRole = findUser.role[0].role;
            // console.log(userRole);
            const currentUTCTime = await getCurrentUTCTimestamp();

            const guestDetails = await guestTypeModel.findOne({ guestId: guestId });

            if (!guestDetails) {
                return res.status(404).json({ message: "Booking source not found", statuscode: 404 });
            }
            if (shortCode) {
                const shortCodeObject = {
                    shortCode: shortCode,
                    logId: Randomstring.generate(10)
                };
                guestDetails.shortCode.unshift(shortCodeObject);
            }

            if (guestTypeName) {
                const guestTypeNameObject = {
                    guestTypeName: guestTypeName,
                    logId: Randomstring.generate(10)
                };
                guestDetails.guestTypeName.unshift(guestTypeNameObject);
            }
        
            if (displayStatus) {
                const displayStatusObject = {
                    displayStatus: displayStatus,
                    logId: Randomstring.generate(10)
                };
                guestDetails.displayStatus.unshift(displayStatusObject);

                const modifiedByObject = {
                    modifiedBy: userRole,
                    logId: Randomstring.generate(10)
                };
                guestDetails.modifiedBy.unshift(modifiedByObject);
                const currentUTCTime = await getCurrentUTCTimestamp()
                guestDetails.modifiedOn.unshift({ modifiedOn: currentUTCTime, logId: Randomstring.generate(10) });


                await guestDetails.save();
                return res.status(200).json({ message: "guestType successfully updated", statuscode: 200 });
            }

        } else {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }

    }catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
    }
};
export default updateGuestType;