import otaSource from '../../models/otaSources.js';
import { findUserByUserIdAndToken } from '../../helpers/helper.js';

const getOtaSource = async (req, res) => {
    try {
        const { propertyId, userId } = req.query;
        const authCodeValue = req.headers['authcode']

        const result = await findUserByUserIdAndToken(userId, authCodeValue);

        if (result.success) {
            const findAllOtaSources = await otaSource.find({ propertyId }, 'propertyId otaId otaName').lean();

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
                return res.status(404).json({ message: "No Ota sources found", statuscode: 404 })
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