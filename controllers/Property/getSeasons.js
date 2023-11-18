import season from '../../models/season.js';
import { convertTimestampToCustomFormat, findUserByUserIdAndToken } from '../../helpers/helper.js';
import properties from '../../models/property.js'

const getSeasons = async (req, res) => {
    try {
        const { targetTimeZone, propertyId, userId } = req.query;
        const authCodeValue = req.headers['authcode']

        const findProperty = await properties.findOne({ propertyId: propertyId, userId: userId});
        if (!findProperty) {
            return res.status(404).json({ message: "Please enter valid propertyId and userId", statuscode: 404 })
        }

        const result = await findUserByUserIdAndToken(userId, authCodeValue);

        if (result.success) {
            const findAllSeasons = await season.find({ propertyId, "displayStatus.0.displayStatus": "1" });

            if (findAllSeasons.length > 0) {
                const convertedSeasons = findAllSeasons.map(seasons => {
                    const convertedDateUTC = convertTimestampToCustomFormat(seasons.createdOn, targetTimeZone);
                    var convertedModifiedOn = ''
                    if (seasons.modifiedOn.length === 0) {
                        convertedModifiedOn = ''
                    } else {
                        convertedModifiedOn = convertTimestampToCustomFormat(seasons.modifiedOn[0].modifiedOn, targetTimeZone);
                    }

                    const modifiedBy = seasons.modifiedBy.length > 0 ? seasons.modifiedBy[0].modifiedBy : "";

                    return {
                        
                        createdOn: convertedDateUTC,
                        createdBy:seasons.createdBy,
                        propertyId:seasons.propertyId,
                        shortCode: seasons.shortCode[0].shortCode || '',
                        seasonName: seasons.seasonName[0].seasonName || '',
                        modifiedBy: modifiedBy,
                        seasonId: seasons.seasonId || '',
                        modifiedOn: convertedModifiedOn,
                        startDate: seasons.startDate[0].startDate || '',
                        endDate: seasons.endDate[0].endDate || '',
                        days: seasons.days.length > 0 ? seasons.days[0].days : ""
                    };
                });

                return res.status(200).json({ data: convertedSeasons, statuscode: 200 });
            } else {
                return res.status(200).json({ message: "No seasons found", statuscode: 200 });
            }
        } else {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
    }
};

export default getSeasons;
