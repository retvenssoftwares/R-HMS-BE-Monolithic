import randomstring from 'randomstring';
import propertyImageModel from '../../models/propertyImages.js';
import propertyImageLogModel from '../../models/LogModels/propertyImagesLog.js';
import verifiedUser from '../../models/verifiedUsers.js';
import { uploadImageToS3, getCurrentUTCTimestamp, findUserByUserIdAndToken } from '../../helpers/helper.js';

const uploadPropertyImages = async (req, res) => {

    const { userId, propertyId } = req.query
    const {imageTags,deviceType,ipAddress}=req.body

    try {

        const findUser = await verifiedUser.findOne({ userId });
        if (!findUser || !userId) {
            return res.status(404).json({ message: "User not found", statuscode: 404 });
        }

        const authCodeValue = req.headers['authcode']
        const result = await findUserByUserIdAndToken(userId, authCodeValue)

        if (result.success) {
            const imageId = randomstring.generate(8);
            var imageUrl = "";

            if (req.files['hotelImage']) {
                imageUrl = await uploadImageToS3(req.files['hotelImage'][0]);
            }

            const logId=randomstring.generate(8);
            // Create the image object
            const imageObject = {
                imageId: imageId,
                image: imageUrl,
                logId: logId,
                displayStatus: "1",
                imageTags: imageTags,// imgTag added to the nested array
                createdOn: await getCurrentUTCTimestamp()
            };

            const imageObject2 = {
                imageId: imageId,
                image: imageUrl,
                displayStatus: "1",
                imageTags: imageTags,// imgTag added to the nested array
                logId: logId,
                userId: userId,
                deviceType:deviceType,
                ipAddress:ipAddress,
                modifiedOn: await getCurrentUTCTimestamp()
            };

            // Find the propertyImage document by propertyId and push the new image object
            // const updateRecord = await propertyImageModel.findOneAndUpdate(
            //     { propertyId: propertyId },
            //     {
            //         $push: {
            //             propertyImages: imageObject,
            //         },
            //         $position:0
            //     },
            //     { new: true }
            // );
            const updateRecord = await propertyImageModel.findOneAndUpdate(
                { propertyId: propertyId },
                {
                    $push: {
                        propertyImages: {
                            $each: [imageObject],
                            $position: 0
                        }
                    },
                },
                { new: true }
            );
            
            if (updateRecord) {
                
                // save data in logs
                await propertyImageLogModel.findOneAndUpdate(
                    { propertyId: propertyId },
                    {
                        $push: {
                            propertyImages: {
                                $each: [imageObject2],
                                $position: 0
                            }
                        }
                    },
                    { new: true }
                );
                
                return res.status(200).json({
                    message: "Image successfully uploaded",
                    data: responseImageObject, statuscode: 200
                });
            } else {
                return res.status(404).json({ message: "Property not found", statuscode: 404 });
            }

        } else {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }
    } catch (error) {
        console.error("Error uploading image:", error);
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
    }
};

export default uploadPropertyImages;
