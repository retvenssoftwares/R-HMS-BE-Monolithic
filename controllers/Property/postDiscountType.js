import discountTypeModel from "../../models/discountType.js";
import * as dotenv from "dotenv";
dotenv.config();
import userModel from "../../models/verifiedUsers.js"
import randomString from "randomstring"
import { getCurrentUTCTimestamp, findUserByUserIdAndToken } from "../../helpers/helper.js";

export const addDiscountType = async (req, res) => {
     try{
          const {
            userId,
            propertyId,
            shortCode,
            discountTypeId,
            discountTypeName,
            discountValue,
            discountType,
            discountPercent,
            discountPrice,

          }= req.body;

          const authCodeValue = req.headers['authcode']
        const findUser = await userModel.findOne({ userId })
        if (!findUser) {
            return res.status(404).json({ message: "User not found or invalid userId", statuscode: 404 })
          }

          const result = await findUserByUserIdAndToken(userId, authCodeValue)
         
          if (result.success) {
            let userRole = findUser.role[0].role
            const currentUTCTime = await getCurrentUTCTimestamp();
            const newDiscountType = new discountTypeModel({
                  propertyId,
                  shortCode: [{
                    shortCode: shortCode,
                    logId: randomString.generate(10)
                  }],
                  displayStatus: [{ displayStatus: "1", logId: randomString.generate(10) }],
                  discountTypeId: randomString.generate(8),
                  createdBy: userRole,
                  createdOn: currentUTCTime,
                  modifiedBy: [],
                  modifiedOn: [],
                  discountTypeName: [
                    {
                        discountTypeName: discountTypeName,
                        logId: randomString.generate(10)
                    },
                  ],
                  discountValue: [
                    {
                        discountValue: discountValue,
                        logId: randomString.generate(10)
                    },
                  ],
                  discountType : [
                    {
                        discountType: discountType,
                        logId: randomString.generate(10)
                    },
                  ],
                  discountPercent: [{
                    discountPercent: discountPercent,
                    logId: randomString.generate(10)
                  }],
                  discountPrice: [
                    {
                        discountPrice: discountPrice,
                        logId: randomString.generate(10)
                    },
                  ],

            });
            await newDiscountType.save()
            return res.status(200).json({ message: "discountType added successfully", statuscode: 200 })

        } else {
          return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }   

     }catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 })
    }
}
export default addDiscountType


