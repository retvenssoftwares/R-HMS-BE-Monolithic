import lostAndFoundModel from '../../models/lostAndFound.js';
import {findUserByUserIdAndToken,validateHotelCode } from '../../helpers/helper.js';
const getFoundData = async (req, res) => {
    try {
        const { propertyId, userId } = req.query;
        const authCodeValue = req.headers['authcode']
        const results = await validateHotelCode(userId, propertyId)
            if (!results.success) {
                return res.status(results.statuscode).json({ message: "Invalid propertyId entered", statuscode: results.statuscode })
            }
        const result = await findUserByUserIdAndToken(userId, authCodeValue);

        if (result.success) {
            const findLostAndFoundData = await lostAndFoundModel.find({ propertyId}).sort({_id:-1}).lean();

            if (findLostAndFoundData.length > 0) {
                const convertedFoundData = findLostAndFoundData.map(found => {
                    return {
        
                        itemImage: found.itemImage[0].itemImage || '',
                         propertyId:found.propertyId,
                        description: found.description[0].description || '',
                        dateFound: found.dateFound[0].dateFound || '',
                        foundBy: found.foundBy[0].foundBy || '',
                        locationFound:found.locationFound[0].locationFound || '',
                        claimStatus:found.claimStatus || ''
                    };
                });

                return res.status(200).json({ data: convertedFoundData, statuscode: 200 });
            } else {
                return res.status(200).json({ message: "No found data found",count:"0", statuscode: 200 });
            }
        } else {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
    }
};

export default getFoundData;
