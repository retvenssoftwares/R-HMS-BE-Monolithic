import mmtModel from '../../models/mmtModel.js'
import property from '../../models/property.js'
import { findUserByUserIdAndToken, getCurrentUTCTimestamp } from '../../helpers/helper.js'

const addMMTRecord = async (req, res) => {
    try {
        const { userId } = req.query
        const authCodeValue = req.headers['authcode']

        const result = await findUserByUserIdAndToken(userId, authCodeValue);
        if (result.success) {
            const { propertyId, otaId } = req.body
            const mmtRecord = new mmtModel({
                otaId: otaId,
                title: req.body.title,
                otaPropertyId: req.body.otaPropertyId,
                currency: req.body.currency,
                propertyId: propertyId,
                accessToken: req.body.accessToken,
                mappingData: [{
                    otaRatePlanId: req.body.otaRatePlanId,
                    linkedRatePlanId: req.body.linkedRatePlanId
                }]
            });

            await mmtRecord.save()
            await property.findOneAndUpdate(
                { propertyId: propertyId },
                { $push: { OTAs: { otaId: otaId, activatedOn: await getCurrentUTCTimestamp() } } }, // The update operation using $push
                { new: true })
            return res.status(200).json({ message: "MMT OTA Mapping successful", statuscode: 200 })
        } else {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 })
    }
}

export default addMMTRecord