import otaSource from '../../models/otaSources.js';
import { findUserByUserIdAndToken } from '../../helpers/helper.js';
import properties from '../../models/property.js'

const getOtaSource = async (req, res) => {
    try {
        const { propertyId, userId } = req.query;
        const authCodeValue = req.headers['authcode']

        const findProperty = await properties.findOne({ propertyId:propertyId, userId: userId });
        if (!findProperty) {
            return res.status(404).json({ message: "Please enter valid propertyId and userId", statuscode: 404 })
        }
        const result = await findUserByUserIdAndToken(userId, authCodeValue);

        if (result.success) {
            const findAllOtaSources = await otaSource.find({ propertyId }, 'propertyId otaId otaName').sort({_id:-1}).lean();

            if (findAllOtaSources.length > 0) {
                const mappedOtaSource = findAllOtaSources.map((source) => {
                    return {
                        ...source._doc,
                        propertyId : source.propertyId || '',
                        otaId : source.otaId || '',
                        otaName : source.otaName[0].otaName || ''
                       
    
                    }
                })
                return res.status(200).json({ data: mappedOtaSource, statuscode: 200 })
            } else {
                return res.status(200).json({ message: "No Ota sources found", statuscode: 200 })
            }
        }else {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }
        }catch (error) {
            console.log(error)
            return res.status(500).json({ message: "Internal server error", statuscode: 500 });
        }
    }

export default getOtaSource;