import Randomstring from 'randomstring'
import season from '../../models/season.js'
import verifiedUser from '../../models/verifiedUsers.js'
import { getCurrentUTCTimestamp, findUserByUserIdAndToken } from '../../helpers/helper.js'
import seasonsLog from '../../models/LogModels/seasonsLog.js'

const patchSeason = async (req, res) => {
    try {
        const { userId } = req.query
        const { shortCode, seasonName, startDate, endDate, days,deviceType,ipAddress } = req.body;
        const seasonId = req.query.seasonId;
        const authCodeValue = req.headers['authcode'];
        const findUser = await verifiedUser.findOne({ userId });

        if (!findUser) {
            return res.status(404).json({ message: "User not found or invalid userid", statuscode: 404 })
        }

        let userRole = findUser.role[0].role;
        const userid =findUser.userId;

        const result = await findUserByUserIdAndToken(userid, authCodeValue)

        if (result.success) {
            const findSeason = await season.findOne({ seasonId });

            if (!findSeason || !seasonId) {
                return res.status(404).json({ message: "Season not found", statuscode: 404 });
            }

            if (shortCode) {
                const shortCodeObject = {
                    shortCode: shortCode,
                    logId: Randomstring.generate(10),
                };
                findSeason.shortCode.unshift(shortCodeObject);
            }

            const currentUTCTime = await getCurrentUTCTimestamp();

            if (seasonName) {
                const seasonNameObject = {
                    seasonName: seasonName,
                    logId: Randomstring.generate(10)
                };
                findSeason.seasonName.unshift(seasonNameObject);
            }

            if (startDate) {
                const startDateObject = {
                    startDate: startDate,
                    logId: Randomstring.generate(10)
                };
                findSeason.startDate.unshift(startDateObject);
            }

            if (endDate) {
                const endDateObject = {
                    endDate: endDate,
                    logId: Randomstring.generate(10)
                };
                findSeason.endDate.unshift(endDateObject);
            }

            if (days) {
                const daysArray = days.map(dayString => dayString.trim());
                const daysObject = { days: daysArray, logId: Randomstring.generate(10) }
                findSeason.days.unshift(daysObject);
            }

            const modifiedByObject = {
                modifiedBy: userRole,
                logId: Randomstring.generate(10)
            };

            findSeason.modifiedBy.unshift(modifiedByObject);
            findSeason.modifiedOn.unshift({ modifiedOn: currentUTCTime, logId: Randomstring.generate(10) });

            const updatedSeason = await findSeason.save();

            if (updatedSeason) {

                // save data in logs
                const findSeasonLog = await seasonsLog.findOne({ seasonId });

                if (findSeasonLog){
                if (shortCode) {
                    const shortCodeObject = {
                        shortCode:updatedSeason.shortCode[0].shortCode,
                        logId:updatedSeason.shortCode[0].logId,
                        userId:userid,
                        deviceType:deviceType,
                        ipAddress:ipAddress,
                        modifiedOn:currentUTCTime,
                    };
                    findSeasonLog.shortCode.unshift(shortCodeObject);
                }

                if (seasonName) {
                    const seasonNameObject = {
                        seasonName:updatedSeason.seasonName[0].seasonName,
                        logId:updatedSeason.seasonName[0].logId,
                        userId:userid,
                        deviceType:deviceType,
                        ipAddress:ipAddress,
                        modifiedOn:currentUTCTime,
                    };
                    findSeasonLog.seasonName.unshift(seasonNameObject);
                }
    
                if (startDate) {
                    const startDateObject = {
                        startDate:updatedSeason.startDate[0].startDate,
                        logId:updatedSeason.startDate[0].logId,
                        userId:userid,
                        deviceType:deviceType,
                        ipAddress:ipAddress,
                        modifiedOn:currentUTCTime,
                    };
                    findSeasonLog.startDate.unshift(startDateObject);
                }
    
                if (endDate) {
                    const endDateObject = {
                        endDate:updatedSeason.endDate[0].endDate,
                        logId:updatedSeason.endDate[0].logId,
                        userId:userid,
                        deviceType:deviceType,
                        ipAddress:ipAddress,
                        modifiedOn:currentUTCTime,
                    };
                    findSeasonLog.endDate.unshift(endDateObject);
                }
    
                if (days) {
                    const daysObject = { 
                        endDate:updatedSeason.days[0].days,
                        logId:updatedSeason.days[0].logId,
                        userId:userid,
                        deviceType:deviceType,
                        ipAddress:ipAddress,
                        modifiedOn:currentUTCTime,
                      }
                    findSeasonLog.days.unshift(daysObject);
                }
            }
            await findSeasonLog.save();
    
                // const modifiedByObject = {
                //     modifiedBy: userRole,
                //     logId: Randomstring.generate(10)
                // };
    
                // findSeasonLog.modifiedBy.unshift(modifiedByObject);
                // findSeasonLog.modifiedOn.unshift({ modifiedOn: currentUTCTime, logId: Randomstring.generate(10) });

                return res.status(200).json({ message: "Season updated successfully ", statuscode: 200 });
            }
        } else {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
    }
}

export default patchSeason;
