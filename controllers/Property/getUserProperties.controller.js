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
        const userProperties = await propertyModel.find({ userId: userId }, 'hotelRcode propertyName propertyType city country amenities -_id createdOn propertyId').lean();
        const result = await findUserByUserIdAndToken(userId, authCodeValue);


        if (result.success) {
            if (userProperties.length > 0) {
                const convertedPropertiesPromises = userProperties.map(async (property) => {
                    const convertedDateUTC = convertTimestampToCustomFormat(property.createdOn, targetTimeZone);
                    const amenitiesCount = (property.amenities && property.amenities[0] && property.amenities[0].amenities) || 0;

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
                        city: property.city[0].city || '',
                        country: property.country || '',
                        propertyId: property.propertyId,
                        totalRooms: propertyRoomsCount,
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
