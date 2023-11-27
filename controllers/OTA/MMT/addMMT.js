import randomstring from 'randomstring'
import * as dotenv from "dotenv";
dotenv.config();
import mmtModel from '../../../models/OTAs/mmtModel.js'
import roomAndRateMap from '../../../models/OTAs/mappedRoomsAndRates.js'
import userModel from "../../../models/verifiedUsers.js";
import property from '../../../models/property.js'
import { findUserByUserIdAndToken, getCurrentUTCTimestamp } from '../../../helpers/helper.js'

const addMMTRecord = async (req, res) => {
    try {
        const { userId, propertyId } = req.query
        const authCodeValue = req.headers['authcode']

        const user = await userModel.findOne({ userId: userId })
        if (!user) {
            return res.status(404).json({ message: "User not found or invalid userId", statuscode: 404 })
        }
        let userRole = user.role[0].role;
        // console.log(propertyID.propertyId)

        const result = await findUserByUserIdAndToken(userId, authCodeValue);
        if (result.success) {
            const { otaId, hotelRcode, mmtHotelCode, accessToken, } = req.body
            const mmtRecord = new mmtModel({
                otaId: otaId,
                connectionId: randomstring.generate(15),
                propertyId: propertyId,
                mmtHotelCode: mmtHotelCode,
                userId: userId,
                hotelRcode: hotelRcode,
                accessToken: accessToken,
                createdOn: await getCurrentUTCTimestamp(),
                createdBy: userRole
            });

            await mmtRecord.save()
            await property.findOneAndUpdate(
                { propertyId: propertyId },
                { $push: { OTAs: { otaId: otaId, activatedOn: await getCurrentUTCTimestamp() } } }, // The update operation using $push
                { new: true })

            const mappedRecord = new roomAndRateMap({
                otaId: otaId,
                connectionId: mmtRecord.connectionId,
                OTAHotelCode: mmtHotelCode,
                userId: userId,
                propertyId: propertyId,
                hotelRcode: hotelRcode,
                accessToken: accessToken,
                createdOn: await getCurrentUTCTimestamp(),
                createdBy: userRole,
                mappedOTARoomData: [],
                mappedRatePlanData: []
            });

            await mappedRecord.save()
            return res.status(200).json({ message: "MMT OTA Mapping successful", statuscode: 200, connectionId: mappedRecord.connectionId })
        } else {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 })
    }
}

export default addMMTRecord