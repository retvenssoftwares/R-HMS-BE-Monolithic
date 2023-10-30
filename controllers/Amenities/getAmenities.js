import amenity from '../../models/amenity.js';
import { convertTimestampToCustomFormat, findUserByUserIdAndToken } from '../../helpers/helper.js';

const getAmenities = async (req, res) => {
    try {
        const { targetTimeZone, propertyId, userId } = req.query;
        const authCodeValue = req.headers['authcode']

        const result = await findUserByUserIdAndToken(userId, authCodeValue);

        if (result.success) {
            const findAllAmenities = await amenity.find({ propertyId }).select('amenityId propertyId createdOn amenityName modifiedBy modifiedOn amenityType -_id').lean();

            if (findAllAmenities.length > 0) {
                const convertedAmenity = findAllAmenities.map(amenities => {
                    const convertedDateUTC = convertTimestampToCustomFormat(amenities.createdOn, targetTimeZone);
                    var convertedModifiedOn;
                    if (amenities.modifiedOn.length === 0) {
                        convertedModifiedOn = {}
                    } else {
                        convertedModifiedOn = convertTimestampToCustomFormat(amenities.modifiedOn[0].modifiedOn, targetTimeZone);
                    }

                    const modifiedBy = amenities.modifiedBy.length > 0 ? amenities.modifiedBy[0].modifiedBy : "";

                    return {
                        ...amenities._doc,
                        createdOn: convertedDateUTC,
                        amenityName: amenities.amenityName[0] || {},
                        modifiedBy: modifiedBy,
                        modifiedOn: convertedModifiedOn,
                        amenityType: amenities.amenityType[0] || {}
                    };
                });

                return res.status(200).json({ data: convertedAmenity, statuscode: 200 });
            } else {
                return res.status(404).json({ error: "No amenities found", statuscode: 404 });
            }
        } else {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export default getAmenities;
