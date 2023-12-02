import Randomstring from "randomstring";
import * as dotenv from "dotenv";
dotenv.config();
import verifiedUser from "../../models/verifiedUsers.js";
import taxTypeModel from "../../models/taxType.js";
import {
    getCurrentUTCTimestamp,
    findUserByUserIdAndToken,
} from "../../helpers/helper.js";

const postTaxType = async (req, res) => {
    console.log("efo")
    try {
        const {
            userId,
            propertyId,
            taxId,
            taxTypeName,
            shortCode,
            taxType,
            slabs,
            isSlabs,
            taxRate,
            applyAfter,

        } = req.body;
        const authCodeValue = req.headers["authcode"];
        const findUser = await verifiedUser.findOne({ userId });
        if (!findUser) {
            return res
                .status(400)
                .json({ message: "User not found or invalid userId", statuscode: 400 });
        }
        const result = await findUserByUserIdAndToken(userId, authCodeValue);
        console.log("frgeg",result)
        const currentUTCTime = await getCurrentUTCTimestamp();

        if (result.success) {
            let userRole = findUser.role[0].role;
            const newTaxType = new taxTypeModel({
                propertyId,
                taxId: Randomstring.generate(8),

                taxTypeName: [{
                    taxTypeName: taxTypeName,
                    logId: Randomstring.generate(8),
                }],

                shortCode: [{
                    shortCode: shortCode,
                    logId: Randomstring.generate(8),
                }],

                taxType: [{
                    taxType: taxType,
                    logId: Randomstring.generate(8),
                }],

                // discountPrice: [{
                //     discountPrice: discountPrice,
                //     logId: Randomstring.generate(8),
                // }],

                isSlabs : [{
                    isSlabs: isSlabs,
                    logId: Randomstring.generate(8),
                }],
                slabs: [{
                    slabs: slabs,
                    logId: Randomstring.generate(8),
                }],

                applyAfter: [{
                    applyAfter: applyAfter,
                    logId: Randomstring.generate(8),
                }],

                taxRate: [{
                    taxRate: taxRate,
                    logId: Randomstring.generate(8),
                }],

                createdBy: userRole,

                createdOn: await getCurrentUTCTimestamp(),
                displayStatus: [{ displayStatus: "1", logId: Randomstring.generate(8) }],
                createdOn: currentUTCTime,

                modifiedBy: [],
                modifiedOn: [],

            });
            await newTaxType.save();
            console.log("asdfghj",newTaxType)

            return res
                .status(200)
                .json({ message: "New Tax Type added successfully", statuscode: 200 });
        } else {
            return res
                .status(result.statuscode)
                .json({ message: result.message, statuscode: result.statuscode });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
    }
};
export default postTaxType;