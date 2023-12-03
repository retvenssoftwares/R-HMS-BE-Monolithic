import Randomstring from 'randomstring'
import taxTypeModel from '../../models/taxType.js'
import verifiedUser from '../../models/verifiedUsers.js'
import { getCurrentUTCTimestamp, findUserByUserIdAndToken } from '../../helpers/helper.js'

const patchTaxType = async (req, res) => {
    try{
    const { userId, taxId } = req.query
    const { shortCode, taxTypeName, taxType, isSlabs, slabs, applyAfter, taxRate, displayStatus} = req.body;
    const authCodeValue = req.headers['authcode'];
        const findUser = await verifiedUser.findOne({ userId });
        // const userid = findUser.userId;

        if (!findUser) {
            return res.status(404).json({ message: "User not found or invalid userid", statuscode: 404 })
        }
        const result = await findUserByUserIdAndToken(userId, authCodeValue)
        if (result.success) {
            let userRole = findUser.role[0].role;

            const findTaxType = await taxTypeModel.findOne({ taxId: taxId });

            if (!findTaxType) {
                return res.status(404).json({ message: "taxId not found", statuscode: 404 });
            }

            const currentUTCTime = await getCurrentUTCTimestamp();

            if (taxTypeName) {
                const taxTypeNameObject = {
                    taxTypeName: taxTypeName,
                    logId: Randomstring.generate(10)
                };
                findTaxType.taxTypeName.unshift(taxTypeNameObject);
            }

            if (displayStatus) {
                const displayStatusObject = {
                    displayStatus: displayStatus,
                    logId: Randomstring.generate(10)
                };
                findTaxType.displayStatus.unshift(displayStatusObject);
            }
            
            if (shortCode) {
                const shortCodeObject = {
                    shortCode: shortCode,
                    logId: Randomstring.generate(10)
                };
                findTaxType.shortCode.unshift(shortCodeObject);
            }
            
            if (taxType) {
                const taxTypeObject = {
                    taxType: taxType,
                    logId: Randomstring.generate(10)
                };
                findTaxType.taxType.unshift(taxTypeObject);
            }

            if (isSlabs) {
                const isSlabsObject = {
                    isSlabs: isSlabs,
                    logId: Randomstring.generate(10)
                };
                findTaxType.isSlabs.unshift(isSlabsObject);
            }

            if (slabs) {
                const slabsObject = {
                    slabs: slabs,
                    logId: Randomstring.generate(10)
                };
                findTaxType.slabs.unshift(slabsObject);
            }
           
            if (applyAfter) {
                const applyAfterObject = {
                    applyAfter: applyAfter,
                    logId: Randomstring.generate(10)
                };
                findTaxType.applyAfter.unshift(applyAfterObject);
            }

            if (taxRate) {
                const taxRateObject = {
                    taxRate: taxRate,
                    logId: Randomstring.generate(10)
                };
                findTaxType.taxRate.unshift(taxRateObject);
            }

            const modifiedByObject = {
                modifiedBy: userRole,
                logId: Randomstring.generate(10)
            };
            findTaxType.modifiedBy.unshift(modifiedByObject);
            findTaxType.modifiedOn.unshift({ modifiedOn: currentUTCTime, logId: Randomstring.generate(10) });

            await findTaxType.save();

            return res.status(200).json({ message: "tax Type successfully updated", statuscode: 200 });

        }else {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }
    }catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
    }

}
export default patchTaxType;