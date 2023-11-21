import roomAndRateMap from "../../models/OTAs/mappedRoomsAndRates.js";
import { findUserByUserIdAndToken } from "../../helpers/helper.js";

const mapRateData = async (req, res) => {

    try {
        const { userId } = req.query
        const authCodeValue = req.headers['authcode']
        const { otaId, otaRoomTypeCode, roomTypeId, ratePlanId, otaRatePlanCode } = req.body;
        const result = await findUserByUserIdAndToken(userId, authCodeValue)
        if (!result.success) {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }

        const findRecord = await roomAndRateMap.findOne({ otaId }).lean();
        if (!findRecord) {
            return res.status(404).json({ message: "Incorrect otaId", statuscode: 404 });
        }

        await roomAndRateMap.findOneAndUpdate(
            { otaId: otaId },
            { $push: { mappedRatePlanData: { otaRoomTypeCode: otaRoomTypeCode, roomTypeId: roomTypeId, ratePlanId: ratePlanId, otaRatePlanCode: otaRatePlanCode } } }, // The update operation using $push
            { new: true })
        return res.status(200).json({ message: "Rate mapped successfully", statuscode: 200 })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
    }

}

export default mapRateData;