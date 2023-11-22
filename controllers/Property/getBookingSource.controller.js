import * as dotenv from "dotenv";
dotenv.config();
import bookingModel from "../../models/bookingSource.js";
import { convertTimestampToCustomFormat, findUserByUserIdAndToken } from "../../helpers/helper.js";
import properties from '../../models/property.js'
const bookingSourcesGet = async (req, res) => {
    try {
        const { targetTimeZone, userId, propertyId } = req.query;

        const findProperty = await properties.findOne({ propertyId :propertyId, userId: userId});
        if (!findProperty) {
            return res.status(404).json({ message: "Please enter valid propertyId and userId", statuscode: 404 })
        }
        const authCodeValue = req.headers['authcode']
        const result = await findUserByUserIdAndToken(userId, authCodeValue)

        if (result.success) {
            const bookingSource = await bookingModel.find({ propertyId: propertyId, "displayStatus.0.displayStatus": "1"  }).sort({_id:-1}).lean();
            if (bookingSource.length > 0) {
                const convertedBookingSources = bookingSource.map(bookingSource => {
                    const convertedDateUTC = convertTimestampToCustomFormat(bookingSource.createdOn, targetTimeZone);
                    let convertedModifiedOn;
                    if (bookingSource.modifiedOn.length === 0) {
                        convertedModifiedOn = ""
                    } else {
                        convertedModifiedOn = convertTimestampToCustomFormat(bookingSource.modifiedOn[0].modifiedOn, targetTimeZone);
                    }
                    const modifiedBy = bookingSource.modifiedBy.length > 0 ? bookingSource.modifiedBy[0].modifiedBy : "";
                    return {
                        ...bookingSource._doc,
                        createdOn: convertedDateUTC,
                        bookingSourceId: bookingSource.bookingSourceId || '',
                        createdBy: bookingSource.createdBy,
                        bookingSource: bookingSource.bookingSource[0].bookingSource || '',
                        modifiedBy: modifiedBy,
                        modifiedOn: convertedModifiedOn || '',
                        shortCode: bookingSource.shortCode[0].shortCode || '',
                    };
                });

                return res.status(200).json({ data: convertedBookingSources, statuscode: 200 });
            }
            else {
                return res.status(200).json({ message: "No booking sources found",count:"0", statuscode: 200 });
            }
        } else {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
    }
};

export default bookingSourcesGet;
