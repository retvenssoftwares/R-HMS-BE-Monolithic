import { findUserByUserIdAndToken } from "../../helpers/helper.js";
import folio from "../../models/folio.js"
import verifiedUser from "../../models/verifiedUsers.js";
import Randomstring from "randomstring";

export const addAdjustment = async (req, res) => {

    const { folioNo, propertyId, userId, adjustmentFor, adjustmentAmount, narration } = req.body
    const findUser = await verifiedUser.findOne({ userId: userId });

    if (!findUser) {
        return res
            .status(404)
            .json({ message: "User not found or invalid userid", statuscode: 404 });
    }
    const authCodeValue = req.headers["authcode"];

    const result = await findUserByUserIdAndToken(userId, authCodeValue);

    if (!result.success) {
        return res.status(404).json({ message: " Invalid Token", statusCode: 404 })
    }

    const adjustedAmount = adjustmentAmount.startsWith('-') ? -parseFloat(adjustmentAmount.substring(1)) : parseFloat(adjustmentAmount);

    const updatedFolio = await folio.updateOne(
        { folioNo: folioNo, propertyId: propertyId },
        {
            $inc: { 
                totalBalance: adjustedAmount,
            },
            $push: {
                folioRecords: {
                    $each: [
                        {
                            date: new Date(),
                            refNo: Randomstring.generate({ charset: 'numeric', length: 10 }),
                            user: findUser.role[0].role || "",
                            adjustmentFor: adjustmentFor,
                            adjustmentAmount: adjustmentAmount,
                            narration: narration,
                            logId : Randomstring.generate(10)
                        }
                    ],
                    $position: 0,
                },
            },
        }
    );

    if (updatedFolio) {
        return res.status(200).json({ message: "adjustment added successfully", statusCode: 200 })
    } else {
        return res.status(404).json({ message: "something wrong", statusCode: 404 })
    }
}
