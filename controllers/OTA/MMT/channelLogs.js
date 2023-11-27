import channelLogsModel from "../../../models/OTAs/channelLogs.js";
import { findUserByUserIdAndToken, validateHotelCode } from "../../../helpers/helper.js";

const getChannelLogs = async (req, res) => {
    try {

        const { propertyId, userId, otaId, timeZone } = req.query;
        const authCodeValue = req.headers['authcode']
        const result = await findUserByUserIdAndToken(userId, authCodeValue)
        if (!result.success) {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }
        const result2 = await validateHotelCode(userId, propertyId)
        if (!result2.success) {
            return res.status(result.statuscode).json({ message: "Invalid propertyId entered", statuscode: result.statuscode })
        }
        const getChannelLogs = await channelLogsModel.findOne({ propertyId: propertyId, otaId: otaId }).lean();
        if (!getChannelLogs) {
            return res.status(200).json({ message: "No logs yet", statuscode: 200 })
        }
        return res.status(200).json({ data: getChannelLogs, statuscode: 200 })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 })
    }
}

export default getChannelLogs