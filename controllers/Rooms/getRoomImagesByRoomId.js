import * as dotenv from "dotenv";
dotenv.config();
import roomImagesModel from "../../models/roomTypeImages.js";
import { findUserByUserIdAndToken, validateHotelCode } from "../../helpers/helper.js";

const getRoomImagesType = async (req, res)=>{
      try{
        const { propertyId, roomTypeId, userId } = req.query
        const authCodeValue = req.headers['authcode']

        const result = await findUserByUserIdAndToken(userId, authCodeValue);
        if (result.success) {
            const results = await validateHotelCode(userId, propertyId)
         if (!results.success) {
         return res.status(results.statuscode).json({ message: "Invalid propertyId", statuscode: results.statuscode })
          }
            const images = await roomImagesModel.find({ propertyId: propertyId ,roomTypeId: roomTypeId }).lean();
            if (!images.length > 0) {
                return res.status(404).json({ message: "Please enter valid roomTypeId", statusCode: 404 });
              }
            if (images.length > 0) {
                // return res.status(400).json({ message: "images not found", statuscode: 400})
                const findRoomImages = images.map(images => {
                  
                const roomTypeId = images.roomTypeId || '';
                const uniqueImageTags = {};
                const roomImages = images.roomImages.reduce((acc, roomImage) => {
                const imageTags = roomImage.imageTags[0].imageTags[0].toLowerCase() || '';
    
      // Check if the imageTags value has been encountered before
      if (!uniqueImageTags[imageTags]) {
      uniqueImageTags[imageTags] = true;

      // Include the imageTags value along with all images associated with it
      acc.push({
        imageTags: imageTags,
        images: []
      });
    }

    // Find the corresponding entry in the result array
    const resultEntry = acc.find(entry => entry.imageTags.toLowerCase() === imageTags);

    // Include the image in the images array of the corresponding entry
    resultEntry.images.push({
      image: roomImage.image || ''
    });

    return acc;
  }, []);

                    // Assuming roomImages is an array of images
                    //  const roomImages = images.roomImages.map(roomImage => ({
                    //  imageTags: roomImage.imageTags[0].imageTags[0] || '',
                    //  image: roomImage.image || ''
                    // }));
                  
                    const deletedRoomImages = images.deletedRoomImages || '';
                    
                    return {
                      roomTypeId : roomTypeId,
                      roomImages : roomImages,
                      deletedRoomImages : deletedRoomImages,
                    }
                });
                return res.status(200).json({ data: findRoomImages, statuscode: 200 });
            }else {
                return res.status(200).json({ message: "No images found", statuscode: 200 });
            }

        }else {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
          }
      }catch (error) {
        console.log("error", error);
        res.status(500).json({ message: "Internal Server Error", status: 500 });
      }
};
export default getRoomImagesType;