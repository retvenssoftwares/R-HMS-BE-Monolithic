import companyRatePlane from "../../models/companyRatePlane.js";
import roomTypeModel from "../../models/roomType.js";
import { findUserByUserIdAndToken } from "../../helpers/helper.js";
const getCompanyRatePlan = async (req, res) => {
    try {
        const { roomTypeId, userId } = req.query;

        const result = await findUserByUserIdAndToken(userId, authCodeValue)
        if (result.success) {
            const findRoomType = await roomTypeModel.findOne({ roomTypeId }).lean();
            if (!findRoomType || !roomTypeId) {
                return res.status(400).json({ message: "Room Type not found or invalid roomTypeId", statuscode: 400 })
            }
            const companyRateData = await companyRatePlane.find(roomTypeId).lean();
            if (companyRateData.length > 0) {
                const rateDetails = companyRateData.map(rates => {
                    return {
                        ...rates._doc,
                        companyRatePlanId: rates.companyRatePlanId || '',
                        companyRatePlanName: rates.ratePlanName[0].ratePlanName || '',
                    };

                });

                return res.status(200).json({ data: rateDetails, statuscode: 200 });
            } else {
                return res.status(200).json({ message: "RatePlan not found", statuscode: 200 });
            }
        } else {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", statusCode: 500 });
    }
};

export default getCompanyRatePlan;
