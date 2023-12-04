import randomstring from 'randomstring';
import propertyImageModel from '../../models/propertyImages.js';
import verifiedUser from '../../models/verifiedUsers.js';
import { uploadImageToS3, getCurrentUTCTimestamp, findUserByUserIdAndToken } from '../../helpers/helper.js';

const uploadPropertyImages = async (req, res) => {

    const { userId, propertyId } = req.query
    const { imageTags } = req.body

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

            // Create the image object
            const imageObject = {
                imageId: imageId,
                image: imageUrl,
                displayStatus: "1",
                imageTags: imageTags,// imgTag added to the nested array
                createdOn: await getCurrentUTCTimestamp()
            };

            // Create the resp image object
            const responseImageObject = {
                imageId: imageId,
                image: imageUrl,
                imageTag: imageTags[0].imageTags || []
            };

            // Find the propertyImage document by propertyId and push the new image object
            const updateRecord = await propertyImageModel.findOneAndUpdate(
                { propertyId: propertyId },
                {
                    $push: {
                        propertyImages: imageObject,
                    },
                },
                { new: true }
            );

            // console.log(req.body)
            // console.log(req.files)
            if (updateRecord) {
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
