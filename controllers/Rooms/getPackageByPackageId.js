import packageModel from '../../models/package.js'
import { findUserByUserIdAndToken } from '../../helpers/helper.js';
import verifiedUser from "../../models/verifiedUsers.js";
const getPackage = async (req, res) => {
    try{
        const { userId, packageId } = req.query;
        const findUser=await verifiedUser.findOne({ userId:userId })
        const authCodeValue = req.headers['authcode']
        if(!findUser){
            return res.status(404).json({ message: "Please enter valid userId", statuscode: 404 })
        }
        const result = await findUserByUserIdAndToken(userId, authCodeValue)
        if (result.success) {
            const packageData = await packageModel.find({packageId: packageId,"displayStatus.0.displayStatus":"1" }).sort({_id:-1}).lean();
            // console.log("packageDate", packageData);
            if (!packageData || !packageId) {
                return res.status(400).json({ message: "Please enter packageId", statuscode: 400 })
            }
            if (packageData) {
                const packagesProperties = packageData.map((packages) => {
                    return {
                        propertyId: packages.propertyId || '',
                        packageId: packages.packageId || '',
                        rateType: packages.rateType || '',
                        roomTypeId: packages.roomTypeId || '',
                        ratePlanId: packages.ratePlanId || '',
                        createdBy: packages.createdBy || '',
                        createdOn: packages.createdOn || '',
                        ratePlanName: packages.ratePlanName[0].ratePlanName || '',
                        displayStatus: packages.displayStatus[0].displayStatus || '',
                        shortCode: packages.shortCode[0].shortCode || '',
                        minimumNights: packages.minimumNights[0].minimumNights || '',
                        maximumNights: packages.maximumNights[0].maximumNights || '',
                        packageRateAdjustment: packages.packageRateAdjustment[0].packageRateAdjustment || '',
                        ratePlanInclusion: packages.ratePlanInclusion[0].ratePlanInclusion || '',
                        packageTotal: packages.barRates.packageTotal.length > 0 ? packages.barRates.packageTotal[0].packageTotal: '',
                        extraAdultRate: packages.barRates.extraAdultRate.length > 0 ? packages.barRates.extraAdultRate[0].extraAdultRate: '',
                        extraChildRate: packages.barRates.extraChildRate.length > 0 ? packages.barRates.extraChildRate[0].extraChildRate: '',
                               
                    }
                })
                return res.status(200).json({ data: packagesProperties , statuscode: 200 })
            } else {
                return res.status(200).json({ message: "No package found", statuscode: 200 })
            }
        }else {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }

    }catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error", statuscode: 500 });
    }
}
export default getPackage;