import barRatePlanModel from "../../models/barRatePlan.js";
import roomTypeModel from "../../models/roomType.js";
import { findUserByUserIdAndToken } from "../../helpers/helper.js";

const getRatePlansListWithRooms = async (req, res) => {
    try {
        const { propertyId, userId } = req.query;
        const authCodeValue = req.headers['authcode'];

        const result = await findUserByUserIdAndToken(userId, authCodeValue);
        if (result.success) {
            if (!propertyId) {
                return res.status(400).json({ message: "Please enter propertyId", statuscode: 400 });
            }

            // Find unique roomTypeIds for the given propertyId
            const uniqueRoomTypeIds = await barRatePlanModel.distinct('roomType.roomTypeId', { propertyId });

            if (uniqueRoomTypeIds.length > 0) {
                const foundRateData = await Promise.all(uniqueRoomTypeIds.map(async (roomTypeId) => {
                    const roomType = await roomTypeModel.findOne({ roomTypeId }).select('roomTypeName');

                    const barRatePlans = await barRatePlanModel.find({ propertyId, 'roomType.roomTypeId': roomTypeId })
                        .select("ratePlanName propertyId barRatePlanId barRates");

                    const formattedBarRatePlans = barRatePlans.map((barRatePlan) => ({
                        ratePlanName: barRatePlan.ratePlanName[0].ratePlanName || "",
                        barRatePlanId: barRatePlan.barRatePlanId || "",
                        ratePlanTotal: barRatePlan.barRates.ratePlanTotal[0].ratePlanTotal || ""
                    }));

                    return {
                        propertyId,
                        roomTypeId,
                        roomTypeName: roomType.roomTypeName[0].roomTypeName || '',
                        barRatePlans: formattedBarRatePlans
                    };
                }));

                return res.status(200).json({ data: foundRateData, statuscode: 200 });
            } else {
                return res.status(200).json({ message: "No rateplans found", status: 200 });
            }
        } else {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ message: "Internal Server Error", status: 500 });
    }
};

export default getRatePlansListWithRooms;
