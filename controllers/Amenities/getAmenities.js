import amenity from '../../models/amenity.js';
import { convertTimestampToCustomFormat, findUserByUserIdAndToken, validateHotelCode } from '../../helpers/helper.js';

const getAmenities = async (req, res) => {
    try {
        const { targetTimeZone, propertyId, userId } = req.query;
        const authCodeValue = req.headers['authcode']

        const result = await findUserByUserIdAndToken(userId, authCodeValue);

        if (result.success) {
            if (!propertyId) {
                return res.status(400).json({ message: "Please enter propertyId", statuscode: 400 })
            }

            const result = await validateHotelCode(userId, propertyId)
            if (!result.success) {
                return res.status(result.statuscode).json({ message: "Invalid propertyId entered", statuscode: result.statuscode })
            }
            const findAllAmenities = await amenity.find({ propertyId, "displayStatus.0.displayStatus": "1" }).sort({ createdOn: -1 }).lean();

            if (findAllAmenities.length > 0) {
                const convertedAmenity = findAllAmenities.map(amenities => {
                    const convertedDateUTC = convertTimestampToCustomFormat(amenities.createdOn, targetTimeZone);
                    var convertedModifiedOn;
                    if (amenities.modifiedOn.length === 0) {
                        convertedModifiedOn = ''
                    } else {
                        convertedModifiedOn = convertTimestampToCustomFormat(amenities.modifiedOn[0].modifiedOn, targetTimeZone);
                    }

                    const modifiedBy = amenities.modifiedBy.length > 0 ? amenities.modifiedBy[0].modifiedBy : "";

                    return {
                        ...amenities._doc,
                        createdOn: convertedDateUTC,
                        amenityId: amenities.amenityId || '',
                        createdBy: amenities.createdBy,
                        amenityName: amenities.amenityName[0].amenityName || '',
                        shortCode: amenities.shortCode[0].shortCode || '',
                        modifiedBy: modifiedBy,
                        modifiedOn: convertedModifiedOn,
                        amenityType: amenities.amenityType[0].amenityType || '',
                        amenityIconLink: amenities.amenityIconLink[0].amenityIconLink || '',
                        amenityIcon: amenities.amenityIcon[0].amenityIcon || ''
                    };
                });

                return res.status(200).json({ data: convertedAmenity, statuscode: 200 });
            } else {
                return res.status(200).json({ message: "No amenities found", statuscode: 200 });
            }
        } else {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
    }
};

export default getAmenities;
