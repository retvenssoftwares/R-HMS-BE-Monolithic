import Randomstring from "randomstring"
import bookingSourceModel from "../../models/bookingSource.js";
import {
    getCurrentUTCTimestamp,
    findUserByUserIdAndToken,
} from "../../helpers/helper.js";
import userModel from '../../models/verifiedUsers.js';
import bookingSourceLog from "../../models/LogModels/bookingSourcesLog.js";

const updateBookingSource = async (req, res) => {
    try {
        const bookingSourceId = req.query.bookingSourceId;
        const userId = req.query.userId
        const { bookingSource, shortCode,ipAddress,deviceType,displayStatus } = req.body;
        const authCodeValue = req.headers['authcode'];

        const result = await findUserByUserIdAndToken(userId, authCodeValue)

        const findUser = await userModel.findOne({ userId: userId });

        if (!findUser) {
            return res.status(404).json({ message: "User not found or invalid userId", statuscode: 404 });
        }

        if (result.success) {
            const userRole = findUser.role[0].role;
            // console.log(userRole);
            const currentUTCTime = await getCurrentUTCTimestamp();


            // Find the booking document by its bookingSourceId
            const booking = await bookingSourceModel.findOne({ bookingSourceId: bookingSourceId });

            if (!booking) {
                return res.status(404).json({ message: "Booking source not found", statuscode: 404 });
            }

            // Check if sourceName is provided in the request
            if (bookingSource) {
                const logId1 = Randomstring.generate(10)
                const update1 = {
                    $push: {
                        bookingSource: {
                            $each: [{
                                bookingSource: bookingSource,
                                logId: logId1
                            }],
                            $position: 0
                        }
                    }
                };
                const updatedBookingSourceName = await bookingSourceModel.findOneAndUpdate({ bookingSourceId: bookingSourceId }, update1, {
                    new: true
                });
                
                //save data in logs 
                const update2 = {
                    $push: {
                        bookingSource: {
                            $each: [{
                                bookingSource: bookingSource,
                                logId: logId1,
                                userId: userId,
                                deviceType: deviceType,
                                ipAddress: ipAddress,
                                modifiedOn:currentUTCTime
                            }],
                            $position: 0
                        }
                    }
                };
                await bookingSourceLog.findOneAndUpdate({ bookingSourceId: bookingSourceId }, update2, {
                    new: true
                });
                

            }

            // Check if shortCode is provided in the request
            if (shortCode) {
                const logId1 = Randomstring.generate(10)
                const update1 = {
                    $push: {
                        shortCode: {
                            $each: [{
                                shortCode: shortCode,
                                logId: logId1
                            }],
                            $position: 0
                        }
                    }
                };
                const updatedBookingShortCode = await bookingSourceModel.findOneAndUpdate({ bookingSourceId: bookingSourceId }, update1, {
                    new: true
                });

                //save data in logs
                const update2 = {
                    $push: {
                        shortCode: {
                            $each: [{
                                shortCode: shortCode,
                                logId: logId1,
                                userId: userId,
                                deviceType: deviceType,
                                ipAddress: ipAddress,
                                modifiedOn:currentUTCTime
                            }],
                            $position: 0
                        }
                    }
                };
                 await bookingSourceLog.findOneAndUpdate({ bookingSourceId: bookingSourceId }, update2, {
                    new: true
                });

            }
            
            if (displayStatus) {
                const logId1 = Randomstring.generate(10)
                const update1 = {
                    $push: {
                        displayStatus: {
                            $each: [{
                                displayStatus: displayStatus,
                                logId: logId1
                            }],
                            $position: 0
                        }
                    }
                };
                const updateddisplayStatus = await bookingSourceModel.findOneAndUpdate({ bookingSourceId: bookingSourceId }, update1, {
                    new: true
                });
                
                // save data in logs
                const update2 = {
                    $push: {
                        displayStatus: {
                            $each: [{
                                displayStatus: displayStatus,
                                logId: logId1,
                                userId: userId,
                                deviceType: deviceType,
                                ipAddress: ipAddress,
                                modifiedOn:currentUTCTime
                            }],
                            $position: 0
                        }
                    }
                };
               await bookingSourceLog.findOneAndUpdate({ bookingSourceId: bookingSourceId }, update2, {
                    new: true
                });

            }

            
            const logId2 = Randomstring.generate(10)
            const logId3 = Randomstring.generate(10)
            const update1 = {
                $push: {
                    modifiedBy: {
                        $each: [{
                            modifiedBy: userRole,
                            logId: logId2
                        }],
                        $position: 0
                    },
                    modifiedOn: {
                        $each: [{
                            modifiedOn: await getCurrentUTCTimestamp(),
                            logId: logId3
                        }],
                        $position: 0
                    }
                }
            };
            const updatedBookingShortCode = await bookingSourceModel.findOneAndUpdate({ bookingSourceId: bookingSourceId }, update1, {
                new: true
            });

            return res.status(200).json({ message: "Booking Source updated successfully", statuscode: 200 });
        } else {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }


    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
    }
};

export default updateBookingSource;
