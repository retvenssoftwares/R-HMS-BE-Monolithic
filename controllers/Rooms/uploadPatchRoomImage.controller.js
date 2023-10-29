import roomImageModel from "../../models/roomTypeImages.js";
import * as dotenv from "dotenv";

dotenv.config();

const changeRoomImageIndex = async (req, res) => {
  try {
    const roomTypeId = req.params.roomTypeId;
    const { oldIndex, newIndex } = req.body;

    // Find the document by ID
    const roomImageDoc = await roomImageModel.findOne({ roomTypeId });

    if (!roomImageDoc) {
      return res.status(404).json({ message: "Room image not found" });
    }

    // Ensure the oldIndex and newIndex are within bounds
    if (
      oldIndex < 0 ||
      oldIndex >= roomImageDoc.Room.length ||
      newIndex < 0 ||
      newIndex >= roomImageDoc.Room.length

    )
    //logic
    //-->dsmlkdfm--->ndfsjnfdjun
     {
       console.log("true")
      return res.status(400).json({ message: "Invalid index values" });
    }

    // Remove the object from the oldIndex and insert it at the newIndex
    const [movedObject] = roomImageDoc.Room.splice(oldIndex, 1);
    roomImageDoc.Room.splice(newIndex, 0, movedObject);

    // Save the updated document
    await roomImageDoc.save();

    return res.status(200).json({ message: "Index changed successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
export default changeRoomImageIndex;


// import roomImageModel from "../../models/roomTypeImages.js";
// import * as dotenv from "dotenv";

// dotenv.config();

// const changeRoomImageIndex = async (req, res) => {
//   try {
//     const roomTypeId = req.params.roomTypeId;
//     const { arrayName, oldIndex, newIndex } = req.body;

//     // Find the document by ID
//     const roomImageDoc = await roomImageModel.findOne({ roomTypeId });

//     if (!roomImageDoc) {
//       return res.status(404).json({ message: "Room image not found" });
//     }

//     // Ensure the oldIndex and newIndex are within bounds
//     const targetArray = roomImageDoc[arrayName]; // Get the specified array

//     if (
//       !targetArray || // Check if the specified array exists
//       oldIndex < 0 ||
//       oldIndex >= targetArray.length ||
//       newIndex < 0 ||
//       newIndex >= targetArray.length
//     ) {
//       return res.status(400).json({ message: "Invalid index values" });
//     }

//     // Remove the object from the oldIndex and insert it at the newIndex
//     const [movedObject] = targetArray.splice(oldIndex, 1);
//     targetArray.splice(newIndex, 0, movedObject);

//     // Save the updated document
//     await roomImageDoc.save();

//     return res.status(200).json({ message: "Index changed successfully" });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

// export default changeRoomImageIndex;
