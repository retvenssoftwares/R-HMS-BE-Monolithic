import * as dotenv from "dotenv";
import Randomstring from 'randomstring'
import roomImageModel from "../../models/roomTypeImages.js";
import userModel from "../../models/verifiedUsers.js";
import {
  getCurrentUTCTimestamp,
  uploadImageToS3,
  findUserByUserIdAndToken
} from "../../helpers/helper.js";

dotenv.config();

const RoomImage = async (req, res) => {
  try {
    const roomTypeId = req.query.roomTypeId; // Assuming you get the roomTypeId from the request parameters
    const { userId } = req.query
    const { imageTags } = req.body
    const authCodeValue = req.headers["authcode"]
    const currentUTCTime = await getCurrentUTCTimestamp();

    const findUser = await userModel.findOne({ userId: userId });
    if (!findUser) {
      return res.status(404).json({ message: "User not found or invalid userid", statuscode: 404 })
    }
    const result = await findUserByUserIdAndToken(userId, authCodeValue);

    if (result.success) {
      // Find the existing record by roomTypeId
      const existingRecord = await roomImageModel.findOne({ roomTypeId });

      if (!existingRecord) {
        return res.status(404).json({ message: "Room type not found", statuscode: 404 });
      }

      var imageUrl = "";
      // Upload Room images
      if (req.files["roomImage"]) {
        imageUrl = await uploadImageToS3(req.files['roomImage'][0]);
        existingRecord.roomImages.unshift({
          imageId: Randomstring.generate(8),
          image: imageUrl,
          imageTags: imageTags,// imgTag added to the nested array
          createdOn: currentUTCTime,
        });
      }



      // Save the updated roomImages record
      const updatedRoomImages = await existingRecord.save();
      const respObj = {
        imageId: existingRecord.roomImages[0].imageId || "",
        image: imageUrl,
        imageTag: imageTags[0].imageTags || []
      }
      return res.status(200).json({ message: "Images uploaded successfully", data: respObj, statuscode: 200 });
    }
    else {
      return res.status(result.statuscode).json({ message: result.message });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
  }
};

export default RoomImage
