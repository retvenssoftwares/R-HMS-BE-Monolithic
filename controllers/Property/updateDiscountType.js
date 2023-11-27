import randomstring from 'randomstring'
import discountTypeModel from '../../models/discountType.js'
import verifiedUser from '../../models/verifiedUsers.js'
import { findUserByUserIdAndToken, getCurrentUTCTimestamp } from '../../helpers/helper.js'

const patchDiscountType = async (req, res) => {
    try{
        const { shortCode , displayStatus, discountTypeName, discountValue, discountType, discountPercent, discountPrice} = req.body;
        const { discountTypeId, userId } = req.query;
        const findUser = await verifiedUser.findOne({ userId: userId});

        if (!findUser) {
            return res.status(404).json({ message: "User not found or invalid userid", statuscode: 404 })
        }
        const authCodeValue = req.headers['authcode'];
        const result = await findUserByUserIdAndToken(userId, authCodeValue)
        if (result.success) {
            let userRole = findUser.role[0].role;


            const findDiscountType= await discountTypeModel.findOne({ discountTypeId });
            if (!findDiscountType || !discountTypeId) {
                return res.status(404).json({ message: "meal plan not found", statuscode: 404 });
            }

            if (shortCode) {
                const shortCodeObject = {
                    shortCode: shortCode,
                    logId: randomstring.generate(10)
                };
                findDiscountType.shortCode.unshift(shortCodeObject);
            }

            if (discountTypeName) {
                const discountTypeObject = {
                    discountTypeName: discountTypeName,
                    logId: randomstring.generate(10)
                };
                findDiscountType.discountTypeName.unshift(discountTypeObject);
            }

            if (discountValue) {
                const discountValueObject = {
                    discountValue: discountValue,
                    logId: randomstring.generate(10)
                };
                findDiscountType.discountValue.unshift(discountValueObject);
            }
            const currentUTCTime = await getCurrentUTCTimestamp();
            const modifiedByObject = {
                modifiedBy: userRole,
                logId: randomstring.generate(10)
            };
            findDiscountType.modifiedBy.unshift(modifiedByObject);
            findDiscountType.modifiedOn.unshift({ modifiedOn: currentUTCTime, logId: randomstring.generate(10) });


            if (discountType) {
                const discountTypeObject = {
                    discountType: discountType,
                    logId: randomstring.generate(10)
                };
                findDiscountType.discountType.unshift(discountTypeObject);
            }
            
            if (discountPercent) {
                const discountPercentObject = {
                    discountPercent: discountPercent,
                    logId: randomstring.generate(10)
                };
                findDiscountType.discountPercent.unshift(discountPercentObject);
            }

            if (displayStatus) {
                const displayStatusObject = {
                    displayStatus: displayStatus,
                    logId: randomstring.generate(10)
                };
                findDiscountType.displayStatus.unshift(displayStatusObject);
            }

            if (discountPrice) {
                const discountPriceObject = {
                    discountPrice: discountPrice,
                    logId: randomstring.generate(10)
                };
                findDiscountType.discountPrice.unshift(discountPriceObject);
            }
            await findDiscountType.save();
            return res.status(200).json({ message: "discountType successfully updated", statuscode: 200 });
        
        } else {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }
        
    }catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 })
    }
}
export default patchDiscountType