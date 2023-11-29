import properties from "../../models/property.js";
import propertyImageModel from "../../models/propertyImages.js";
import {
  findUserByUserIdAndToken,
  validateHotelCode,
} from "../../helpers/helper.js";

const getPropertyImage = async (req, res) => {
  try {
    const { userId, propertyId } = req.query;
    const authCodeValue = req.headers["authcode"];
    const result = await findUserByUserIdAndToken(userId, authCodeValue);
 
    if (result.success) {
        const results = await validateHotelCode(userId, propertyId);
        if (!results.success) {
          return res.status(results.statuscode).json({
            message: "Invalid propertyId entered",
            statuscode: results.statuscode,
          });
        }
      const propertyImage = await propertyImageModel.find({ propertyId });
      if (!propertyImage) {
        return res
          .status(200)
          .json({ message: "images not found", statuscode: 200 });
      }
      if (propertyImage) {
        const propertyImage = await propertyImageModel.find({ propertyId });
        if (!propertyImage) {
          return res
            .status(200)
            .json({ message: "images not found", statuscode: 200 });
        }
        if (propertyImage) {
            const groupedImages = {};
          
            propertyImage.forEach((item) => {
              const imageTag =
                item.propertyImages[0]?.imageTags[0]?.imageTags[0];
          
              if (imageTag) {
                const imageTagData = propertyImage.find(
                  (imageItem) =>
                    imageItem.propertyImages[0]?.imageTags[0]?.imageTags[0] === imageTag
                );
          
                if (imageTagData) {
                  const imagesData = propertyImage.filter(
                    (imageItem) =>
                      imageItem.propertyImages[0]?.imageTags[0]?.imageTags[0] === imageTag
                  );
          
                  if (!groupedImages[imageTag]) {
                    groupedImages[imageTag] = {
                      imageTags: imageTag,
                      images: imagesData.map(
                        (imageItem) => imageItem.propertyImages[0]?.image
                      ),
                    };
                  }
                }
              }
            });
          
            const images = Object.values(groupedImages);
          
            return res.status(200).json({ data: images, statuscode: 200 });
          }
          
      }
    }else{
        return res.status(result.statuscode).json({message:"inavlid userId",statuscode: result.statuscode})
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
  }
};
export default getPropertyImage;
