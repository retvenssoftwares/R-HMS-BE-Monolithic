import holiday from '../../models/holidays.js';
import { convertTimestampToCustomFormat, findUserByUserIdAndToken } from '../../helpers/helper.js';
import properties from '../../models/property.js'
const getHoliday = async (req, res) => {
    try {
        const { targetTimeZone, propertyId, userId } = req.query;
        const authCodeValue = req.headers['authcode']
        const findProperty = await properties.findOne({ propertyId:propertyId, userId: userId });
        if (!findProperty) {
            return res.status(404).json({ message: "Please enter valid propertyId and userId", statuscode: 404 })
        }
        const result = await findUserByUserIdAndToken(userId, authCodeValue);

        if (result.success) {
            const findAllHoliday = await holiday.find({ propertyId, "displayStatus.0.displayStatus": "1"  });

            if (findAllHoliday.length > 0) {
                const convertedHoliday = findAllHoliday.map(holidays => {
                    const convertedDateUTC = convertTimestampToCustomFormat(holidays.createdOn, targetTimeZone);
                    var convertedModifiedOn = ''
                    if (holidays.modifiedOn.length === 0) {
                        convertedModifiedOn = ''
                    } else {
                        convertedModifiedOn = convertTimestampToCustomFormat(holidays.modifiedOn[0].modifiedOn, targetTimeZone);
                    }

                    const modifiedBy = holidays.modifiedBy.length > 0 ? holidays.modifiedBy[0].modifiedBy : "";

                    return {
                        
                        shortCode: holidays.shortCode[0].shortCode || '',
                         propertyId:holidays.propertyId,
                        createdOn: convertedDateUTC,
                        createdBy:holidays.createdBy,
                        holidayName: holidays.holidayName[0].holidayName || '',
                        modifiedBy: modifiedBy,
                        holidayId: holidays.holidayId || '',
                        modifiedOn: convertedModifiedOn,
                        startDate: holidays.startDate[0].startDate || '',
                        endDate: holidays.endDate[0].endDate || ''
                    };
                });

                return res.status(200).json({ data: convertedHoliday, statuscode: 200 });
            } else {
                return res.status(200).json({ message: "No holidays found", statuscode: 200 });
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
