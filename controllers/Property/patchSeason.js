import season from '../../models/season.js'
import verifiedUser from '../../models/verifiedUsers.js'
import { getCurrentUTCTimestamp } from '../../helpers/helper.js'

const patchSeason = async (req, res) => {
    try {
        const { userId, seasonShortCode, seasonName, startDate, endDate } = req.body;
        const seasonId = req.params.seasonId;
        const authCodeValue = req.headers['authcode'];
        const findUser = await verifiedUser.findOne({ userId });

        if (!findUser) {
            return res.status(404).json({ message: "User not found or invalid userid", statuscode: 404 })
        }
        const userToken = findUser.authCode;
        let userRole = findUser.role[0].role;

        if (authCodeValue !== userToken) {
            return res.status(400).json({ message: "Invalid authentication token", statuscode: 400 });
        }

        const findSeason = await season.findOne({ seasonId });

        if (!findSeason || !seasonId) {
            return res.status(404).json({ message: "Season not found", statuscode: 404 });
        }

        if (seasonShortCode) {
            findSeason.seasonShortCode = seasonShortCode;
        }

        const currentUTCTime = await getCurrentUTCTimestamp();

        if (seasonName) {
            const seasonNameObject = {
                seasonName: seasonName
            };
            findSeason.seasonName.unshift(seasonNameObject);
        }

        if (startDate) {
            const startDateObject = {
                startDate: startDate
            };
            findSeason.startDate.unshift(startDateObject);
        }

        if (endDate) {
            const endDateObject = {
                endDate: endDate
            };
            findSeason.endDate.unshift(endDateObject);
        }

        const modifiedByObject = {
            modifiedBy: userRole
        };

        findSeason.modifiedBy.unshift(modifiedByObject);
        findSeason.modifiedOn.unshift({ modifiedOn: currentUTCTime });

        const updatedSeason = await findSeason.save();

        if (updatedSeason) {
            return res.status(200).json({ message: "Season successfully updated", statuscode:200 });
        } else {
            return res.status(404).json({ message: "Season not found", statuscode: 404 });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", statuscode:500 });
    }
}

export default patchSeason;
