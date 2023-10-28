import season from '../../models/season.js';
import { convertTimestampToCustomFormat, findUserByUserIdAndToken } from '../../helpers/helper.js';

const getSeasons = async (req, res) => {
    try {
        const { targetTimeZone, propertyId, userId } = req.query;
        const authCodeValue = req.headers['authcode']

        const result = await findUserByUserIdAndToken(userId, authCodeValue);

        if (result.success) {
            const findAllSeasons = await season.find({ propertyId });

            if (findAllSeasons.length > 0) {
                const convertedSeasons = findAllSeasons.map(seasons => {
                    const convertedDateUTC = convertTimestampToCustomFormat(seasons.createdOn, targetTimeZone);
                    var convertedModifiedOn = ''
                    if (seasons.modifiedOn.length === 0) {
                        convertedModifiedOn = ''
                    } else {
                        convertedModifiedOn = convertTimestampToCustomFormat(seasons.modifiedOn[0].modifiedOn, targetTimeZone);
                    }

                    return {
                        ...seasons._doc,
                        createdOn: convertedDateUTC,
                        shortCode: seasons.shortCode[0] || {},
                        seasonName: seasons.seasonName[0] || {},
                        modifiedBy: seasons.modifiedBy[0] || {},
                        modifiedOn: convertedModifiedOn,
                        startDate: seasons.startDate[0] || {},
                        endDate: seasons.endDate[0] || {},
                        days: seasons.days[0] || {}
                    };
                });

                return res.status(200).json({ seasons: convertedSeasons, statuscode: 200 });
            } else {
                return res.status(404).json({ error: "No seasons found", statuscode: 404 });
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
