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
        const companyRatePlan = await companyRatePlanModel.find({ propertyId }).lean();

        if (result.success) {
            // //CompanyRatePlan
            // //Map roomTypeId from companyRatePlan
            // const roomTypeIds = companyRatePlan.map((item) => item.roomTypeId);
            // const roomTypeData = await roomTypeModel.find({ roomTypeId: { $in: roomTypeIds } });

            // // console.log(new Date().getSeconds())
            // const CompanyratePlan = companyRatePlan.map((rate) => {
            //     const matchingRoomTypes = roomTypeData.find((room) => room.roomTypeId === rate.roomTypeId
            //     );

            //     const roomTypeName = matchingRoomTypes?.roomTypeName[0]?.roomTypeName || '';
            //     return {
            //         rateType: rate.rateType || '',
            //         shortCode: rate.shortCode[0].shortCode || '',
            //         ratePlanName: rate.ratePlanName[0].ratePlanName || '',
            //         roomTypeName: roomTypeName,
            //         inclusion: rate.ratePlanInclusion[0].ratePlanInclusion.length || 0,
            //         extraAdultRate: rate.barRates.extraAdultRate[0].extraAdultRate || '',
            //         extraChildRate: rate.barRates.extraChildRate[0].extraChildRate || '',
            //         ratePlanTotal: rate.barRates.ratePlanTotal[0].ratePlanTotal || '',
            //     }
            // });


            // //BarRatePlan
            // //Map roomTypeId from barRatePlan
            // const barRatePlanData = await barRatePlan.find({ propertyId }).lean();
            // const barroomTypeIds = barRatePlanData.map((item) => item.roomType[0].roomTypeId);
            // const roomTypeDatas = await roomTypeModel.find({ roomTypeId: { $in: barroomTypeIds } });

            // // console.log(new Date().getSeconds())
            // const barRatePlanResponse = barRatePlanData.map((rate) => {
            //     const matchingRoomTypes = roomTypeDatas.find((room) => room.roomTypeId === rate.roomType?.roomTypeId
            //     );
            //     const roomTypeName = matchingRoomTypes?.roomTypeName[0]?.roomTypeName || '';
            //     // console.log(roomTypeName, "segfe")
            //     return {
            //         rateType: rate.rateType || '',
            //         shortCode: rate.shortCode[0].shortCode || '',
            //         ratePlanName: rate.ratePlanName[0].ratePlanName || '',
            //         roomTypeName: roomTypeName,
            //         inclusion: rate.inclusion[0].inclusionPlan.length || 0,
            //         extraAdultRate: rate.barRates.extraAdultRate[0].extraAdultRate || '',
            //         extraChildRate: rate.barRates.extraChildRate[0].extraChildRate || '',
            //         ratePlanTotal: rate.barRates.ratePlanTotal[0].ratePlanTotal || '',
            //     };
            // });


            // //PackageRatePlan
            // //Map roomTypeId from packageRatePlan
            // const PackageRatePlanData = await packageModel.find({ propertyId }).lean();
            // const packageroomTypeIds = PackageRatePlanData.map((item) => item.roomTypeId);
            // const packageRoomTypeDatas = await roomTypeModel.find({ roomTypeId: { $in: packageroomTypeIds } });

            // // console.log(new Date().getSeconds())
            // const packageRatePlanResponse = PackageRatePlanData.map((rate) => {
            //     const matchingRoomTypes = packageRoomTypeDatas.find((room) => room.roomTypeId === rate.roomTypeId
            //     );
            //     const roomTypeName = matchingRoomTypes?.roomTypeName[0]?.roomTypeName || '';
            //     // console.log(roomTypeName)
            //     return {
            //         rateType: rate.rateType || '',
            //         shortCode: rate.shortCode[0].shortCode || '',
            //         ratePlanName: rate.ratePlanName[0].ratePlanName || '',
            //         roomTypeName: roomTypeName,
            //         inclusion: rate.ratePlanInclusion[0].ratePlanInclusion.length || 0,
            //         ratePlanTotal: rate.barRates.packageTotal[0].packageTotal || '',
            //         extraAdultRate: rate.barRates.extraAdultRate[0].extraAdultRate || '',
            //         extraChildRate: rate.barRates.extraChildRate[0].extraChildRate || '',
            //     };
            // });


            //discountPlan
            

            const discountRatePlans = await discountPlan.find({ propertyId }, 'discountPlanId shortCode discountName -_id applicableOn').lean();

            const mappedDiscountPlansPromises = discountRatePlans.map(async (rate) => {
                const innerApplicableOn = rate.applicableOn[0]?.applicableOn || [];
                const roomTypeIds = innerApplicableOn.map(applicableOn => applicableOn.roomTypeId);
                const ratePlanIds = rate.applicableOn
                    .flatMap(applicableOn => applicableOn.applicableOn)
                    .flatMap(roomType => roomType.ratePlans.map(ratePlan => ratePlan.rateplanId));

                const findRoomTypes = await roomTypeModel.find({ roomTypeId: { $in: roomTypeIds } }).select('roomTypeId roomTypeName').lean();

                const roomTypeNamesPromises = findRoomTypes.map(async (roomType) => {
                    // const ratePlans = innerApplicableOn.find(applicableOn => applicableOn.roomTypeId === roomType.roomTypeId)?.ratePlans || [];

                    const ratePlanObjects = await Promise.all(ratePlanIds.map(async (ratePlan) => {
                        // Fetch the count of inclusionPlan for each rate plan by matching ratePlanId with barRatePlan collection
                        // console.log(ratePlan, "adfsd")
                        // console.log(roomType.roomTypeId, "fsdaf")
                        const inclusionCount = await barRatePlan.find({
                            propertyId: propertyId,
                            'roomType.roomTypeId': roomType.roomTypeId,
                            barRatePlanId: ratePlan
                        }, 'inclusion.inclusionPlan').lean();

                        let count = 0;

                        if (inclusionCount[0] && inclusionCount[0].inclusion) {
                            inclusionCount[0].inclusion.map((item) => {
                                count += 1;
                                // console.log(item);
                            });
                        }

                        // console.log(count);

                        const inclusionPlanCount = inclusionCount && inclusionCount[0] && inclusionCount[0].inclusion && inclusionCount[0].inclusion.inclusionPlan
                            ? inclusionCount[0].inclusion.inclusionPlan.length
                            : 0;

                        // console.log(inclusionPlanCount, "vghvg");
                        return {
                            roomTypeName: roomType.roomTypeName[0]?.roomTypeName || '',
                            discountName: rate.discountName[0]?.discountName || '',
                            discountPlanId: rate.discountPlanId,
                            rateType: "Discount",
                            ratePlanPrice: ratePlan.newRatePlanPrice || '',
                            newRatePlanName: ratePlan.newRatePlanName || "",
                            extraAdultRate: ratePlan.extraAdultRate || '',
                            extraChildRate: ratePlan.extraChildRate || '',
                            shortCode: rate.shortCode[0]?.shortCode || '',
                            inclusionCount: count || 0,
                        };
                    }));

                    return ratePlanObjects;
                });

                const roomTypeNames = (await Promise.all(roomTypeNamesPromises)).flat();

                return {
                    ...rate._doc,
                    roomTypeNames: roomTypeNames,
                };
            });

            // Use Promise.all to wait for all promises to resolve
            const mappedDiscountPlans = await Promise.all(mappedDiscountPlansPromises);

           
           // return res.status(200).json({ companyRatePlan: CompanyratePlan, barRatePlan: barRatePlanResponse, packageRatePlan: packageRatePlanResponse, discountplans: mappedDiscountPlans, statuscode: 200 });
           return res.status(200).json({  discountplans: mappedDiscountPlans, statuscode: 200 });
        } else {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: "Internal server error", statuscode: 500 })
    }
}
export default allRatePlans