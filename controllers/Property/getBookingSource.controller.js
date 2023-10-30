import * as dotenv from "dotenv";
dotenv.config();
import bookingModel from "../../models/bookingSource.js";
import { convertTimestampToCustomFormat, findUserByUserIdAndToken } from "../../helpers/helper.js";

const bookingSourcesGet = async (req, res) => {
    try {
        const { targetTimeZone, userId, propertyId } = req.query;

        const bookingSource = await bookingModel.find({ propertyId: propertyId }).lean();
        const authCodeValue = req.headers['authcode']
        const result = await findUserByUserIdAndToken(userId, authCodeValue)

        if (result.success) {
            if (bookingSource.length > 0) {
                const convertedBookingSources = bookingSource.map(bookingSource => {
                    const convertedDateUTC = convertTimestampToCustomFormat(bookingSource.createdOn, targetTimeZone);
                    let convertedModifiedOn;
                    if (bookingSource.modifiedOn.length === 0) {
                        convertedModifiedOn = ""
                    } else {
                        convertedModifiedOn = convertTimestampToCustomFormat(bookingSource.modifiedOn[0].modifiedOn, targetTimeZone);
                    }

                    return {
                        ...bookingSource._doc,
                        createdOn: convertedDateUTC,
                        createdBy: bookingSource.createdBy,
                        bookingSource: bookingSource.bookingSource[0].bookingSource || {},
                        modifiedBy: bookingSource.modifiedBy[0].modifiedBy || {},
                        modifiedOn: convertedModifiedOn || '',
                        shortCode: bookingSource.shortCode[0].shortCode || {},
                    };
                });

                return res.status(200).json({ data: convertedBookingSources, statuscode: 200 });
            }
            else {
                return res.status(404).json({ error: "No booking sources found", statuscode: 404 });
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
