import * as dotenv from "dotenv";
dotenv.config();
import propertyModel from "../../models/property.js";
import roomTypeModel from '../../models/roomType.js'
import { convertTimestampToCustomFormat, findUserByUserIdAndToken } from "../../helpers/helper.js";

const userProperty = async (req, res) => {
    try {
        const { targetTimeZone } = req.query;
        const userId = req.query.userId;

        const authCodeValue = req.headers['authcode']
        const userProperties = await propertyModel.find({ userId: userId ,"displayStatus.0.displayStatus": "1"}, 'hotelRcode propertyName propertyType city country propertyRating hotelLogo amenities -_id createdOn propertyId').sort({ createdOn: -1 }).lean();
        const result = await findUserByUserIdAndToken(userId, authCodeValue);
        // console.log(userProperties);

        if (result.success) {
            if (userProperties.length > 0) {
                const convertedPropertiesPromises = userProperties.map(async (property) => {
                    const convertedDateUTC = convertTimestampToCustomFormat(property.createdOn, targetTimeZone);
                    const amenitiesCount = (property.amenities && property.amenities[0] && property.amenities[0].amenities) || 0;
                    let hotelLogo = '';
                    if (property.hotelLogo && property.hotelLogo[0] && property.hotelLogo[0].hotelLogo) {
                        hotelLogo = property.hotelLogo[0].hotelLogo;
                    }

                    // console.log(amenitiesCount.length)
                    const propertyRoomsCount = await roomTypeModel.find({ propertyId: property.propertyId }).select('roomTypeId').countDocuments();

                    let amenitiesLength = 0;
                    if (amenitiesCount !== 0) {
                        amenitiesLength = amenitiesCount.length;
                    }
                    return {
                        ...property._doc,
                        createdOn: convertedDateUTC,
                        hotelRcode: property.hotelRCode,
                        propertyName: property.propertyName[0].propertyName || '',
                        propertyRating: property.propertyRating[0].propertyRating || '',
                        hotelLogo: hotelLogo,
                        city: property.city[0].city || '',
                        country: property.country || '',
                        propertyId: property.propertyId,
                        totalRooms: propertyRoomsCount,
                        propertyType:property.propertyType[0].propertyType,                      
                        amenities: amenitiesLength
                    };
                });

                const convertedProperties = await Promise.all(convertedPropertiesPromises);

                return res.status(200).json({ data: convertedProperties, statuscode: 200 });
            } else {
                return res.status(404).json({ message: "No property found", statuscode: 404 });
            }
        } else {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error", statusCode: 500 });
    }
};

export default userProperty;
