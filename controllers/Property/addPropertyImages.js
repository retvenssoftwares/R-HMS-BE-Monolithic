import randomstring from 'randomstring';
import propertyImageModel from '../../models/propertyImages.js';
import { uploadImageToS3, getCurrentUTCTimestamp } from '../../helpers/helper.js';

const uploadPropertyImages = async (req, res) => {
    const propertyId = req.params.propertyId;

    try {

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
            modifiedDate: await getCurrentUTCTimestamp()
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

        if (updateRecord) {
            return res.status(200).json({ message: "Image successfully uploaded" });
        } else {
            return res.status(404).json({ message: "Property not found" });
        }
    } catch (error) {
        console.error("Error uploading image:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export default uploadPropertyImages;
