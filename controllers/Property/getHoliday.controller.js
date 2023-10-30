import holiday from '../../models/holidays.js';
import { convertTimestampToCustomFormat, findUserByUserIdAndToken } from '../../helpers/helper.js';

const getHoliday = async (req, res) => {
    try {
        const { targetTimeZone, propertyId, userId } = req.query;
        const authCodeValue = req.headers['authcode']

        if (!propertyId) {
            return res.status(400).json({ message: "Please enter valid propertyId", statuscode: 400 })
        }
        const result = await findUserByUserIdAndToken(userId, authCodeValue);

        if (result.success) {
            const findAllHoliday = await holiday.find({ propertyId });

            if (findAllHoliday.length > 0) {
                const convertedHoliday = findAllHoliday.map(holidays => {
                    const convertedDateUTC = convertTimestampToCustomFormat(holidays.createdOn, targetTimeZone);
                    var convertedModifiedOn = ''
                    if (holidays.modifiedOn.length === 0) {
                        convertedModifiedOn = ''
                    } else {
                        convertedModifiedOn = convertTimestampToCustomFormat(holidays.modifiedOn[0].modifiedOn, targetTimeZone);
                    }

                    return {
                        ...holidays._doc,
                        shortCode: holidays.shortCode[0].shortCode || {},
                        createdOn: convertedDateUTC,
                        holidayName: holidays.holidayName[0].holidayName || {},
                        modifiedBy: holidays.modifiedBy[0].modifiedBy || {},
                        modifiedOn: convertedModifiedOn,
                        startDate: holidays.startDate[0].startDate || {},
                        endDate: holidays.endDate[0].endDate || {}
                    };
                });

                return res.status(200).json({ data: convertedHoliday, statuscode: 200 });
            } else {
                return res.status(404).json({ error: "No holidays found", statuscode: 404 });
            }
        } else {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
    }
};

export default getHoliday;
