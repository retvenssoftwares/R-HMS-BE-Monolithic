import companyRatePlanModel from "../../models/companyRatePlane.js";
import barRatePlan from "../../models/barRatePlan.js"
import packageModel from '../../models/package.js'
import discountPlan from "../../models/discountPlan.js"
import roomTypeModel from "../../models/roomType.js";
import { findUserByUserIdAndToken, } from "../../helpers/helper.js";
const allRatePlans = async (req, res) => {
    try {
        const { propertyId, userId } = req.query;
        const authCodeValue = req.headers['authcode']

        const result = await findUserByUserIdAndToken(userId, authCodeValue)
        const companyRatePlan = await companyRatePlanModel.find({ propertyId, "displayStatus.0.displayStatus": "1" }).sort({ _id: -1 }).lean();
        // console.log()
        if (result.success) {
            //CompanyRatePlan
            //Map roomTypeId from companyRatePlan
            const roomTypeIds = companyRatePlan.map((item) => item.roomTypeId);
            const roomTypeData = await roomTypeModel.find({ roomTypeId: { $in: roomTypeIds } });

            // console.log(new Date().getSeconds())
            const CompanyratePlan = companyRatePlan.map((rate) => {
                const matchingRoomTypes = roomTypeData.find((room) => room.roomTypeId === rate.roomTypeId
                );

                const roomTypeName = matchingRoomTypes?.roomTypeName[0]?.roomTypeName || '';
                return {
                    ratePlanId: rate.companyRatePlanId || "",
                    rateType: rate.rateType || '',
                    shortCode: rate.shortCode[0].shortCode || '',
                    ratePlanName: rate.ratePlanName[0].ratePlanName || '',
                    roomTypeName: roomTypeName,
                    inclusion: rate.ratePlanInclusion[0]?.ratePlanInclusion.length || 0,
                    extraAdultRate: rate.barRates.extraAdultRate[0].extraAdultRate || '',
                    extraChildRate: rate.barRates.extraChildRate[0].extraChildRate || '',
                    ratePlanTotal: rate.barRates.ratePlanTotal[0].ratePlanTotal || '',
                }
            });


            //BarRatePlan
            //Map roomTypeId from barRatePlan
            const barRatePlanData = await barRatePlan.find({ propertyId, "displayStatus.0.displayStatus": "1" }).sort({ _id: -1 }).lean();
            const barroomTypeIds = barRatePlanData.map((item) => item.roomType[0].roomTypeId);
            const roomTypeDatas = await roomTypeModel.find({ roomTypeId: { $in: barroomTypeIds } });

            // console.log(new Date().getSeconds())
            const barRatePlanResponse = barRatePlanData.map((rate) => {
                const matchingRoomTypes = roomTypeDatas.find((room) => room.roomTypeId === rate.roomType[0]?.roomTypeId
                );
                const roomTypeName = matchingRoomTypes?.roomTypeName[0]?.roomTypeName || '';
                // console.log(roomTypeName)
                return {
                    rateType: rate.rateType || '',
                    ratePlanId: rate.barRatePlanId || '',
                    shortCode: rate.shortCode[0].shortCode || '',
                    ratePlanName: rate.ratePlanName[0].ratePlanName || '',
                    roomTypeName: roomTypeName,
                    inclusion: rate.inclusion[0]?.inclusionPlan.length || 0,
                    extraAdultRate: rate.barRates.extraAdultRate[0].extraAdultRate || '',
                    extraChildRate: rate.barRates.extraChildRate[0].extraChildRate || '',
                    ratePlanTotal: rate.barRates.ratePlanTotal[0].ratePlanTotal || '',
                };
            });

            //PackageRatePlan
            //Map roomTypeId from packageRatePlan
            const PackageRatePlanData = await packageModel.find({ propertyId, "displayStatus.0.displayStatus": "1" }).sort({ _id: -1 }).lean();
            const packageroomTypeIds = PackageRatePlanData.map((item) => item.roomTypeId);
            const packageRoomTypeDatas = await roomTypeModel.find({ roomTypeId: { $in: packageroomTypeIds } });

            // console.log(new Date().getSeconds())
            const packageRatePlanResponse = PackageRatePlanData.map((rate) => {
                const matchingRoomTypes = packageRoomTypeDatas.find((room) => room.roomTypeId === rate.roomTypeId
                );
                const roomTypeName = matchingRoomTypes?.roomTypeName[0]?.roomTypeName || '';
                // console.log(roomTypeName)
                return {
                    rateType: rate.rateType || '',
                    ratePlanId: rate.ratePlanId || '',
                    shortCode: rate.shortCode[0].shortCode || '',
                    ratePlanName: rate.ratePlanName[0].ratePlanName || '',
                    roomTypeName: roomTypeName,
                    inclusion: rate.ratePlanInclusion[0]?.ratePlanInclusion.length || 0,
                    ratePlanTotal: rate.barRates.packageTotal[0].packageTotal || '',
                    extraAdultRate: rate.barRates.extraAdultRate[0].extraAdultRate || '',
                    extraChildRate: rate.barRates.extraChildRate[0].extraChildRate || '',
                };
            });


            //discountPlan
            //Map roomTypeId from discountRatePlan
            const discountRatePlanData = await discountPlan.find({ propertyId, "displayStatus.0.displayStatus": "1" }).sort({ _id: -1 }).lean();
            const discountroomTypeIds = discountRatePlanData.map((item) => item.roomTypeId);
            const discountRoomTypeDatas = await roomTypeModel.find({ roomTypeId: { $in: discountroomTypeIds } });

            // console.log(new Date().getSeconds())
            const discountRatePlanResponse = discountRatePlanData.map((rate) => {
                const matchingRoomTypes = discountRoomTypeDatas.find((room) => room.roomTypeId === rate.roomTypeId
                );
                const roomTypeName = matchingRoomTypes?.roomTypeName[0]?.roomTypeName || '';
                // console.log(roomTypeName)
                return {
                    rateType: rate.rateType || '',
                    ratePlanId: rate.discountPlanId || '',
                    shortCode: rate.shortCode[0].shortCode || '',
                    ratePlanName: rate.discountName[0].discountName || '',
                    roomTypeName: roomTypeName,
                    newRatePlanName: rate.newRatePlanName[0].newRatePlanName || '',
                    inclusion: rate.ratePlanInclusion[0]?.ratePlanInclusion.length || 0,
                    ratePlanTotal: rate.barRates.discountTotal[0].discountTotal || '',
                    extraAdultRate: rate.barRates.extraAdultRate[0].extraAdultRate || '',
                    extraChildRate: rate.barRates.extraChildRate[0].extraChildRate || '',
                };
            });

            return res.status(200).json({ companyRatePlan: CompanyratePlan, barRatePlan: barRatePlanResponse, packageRatePlan: packageRatePlanResponse, discountplans: discountRatePlanResponse, statuscode: 200 });
        } else {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: "Internal server error", statuscode: 500 })
    }
}
export default allRatePlans