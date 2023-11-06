import roomTypeModel from "../../models/roomType.js";
const getRoom = async (req, res) => {
  try {
    const { propertyId }= req.query
    const findRoom = await roomTypeModel.findOne({ propertyId: propertyId }).select("roomTypeName.roomTypeName roomTypeId").lean();

    if (findRoom.length > 0 ) {
      const foundRoomData = findRoom.map((roomData) => {
        return{
          ...roomData._doc,
          propertyId:roomData.propertyId || "",
        }
      })
      return res.status(200).json({data:foundRoomData,statuscode:200});

    } else {
      console.log("error to fetch");
      res.json({ message: "not found", status: 0 });
    }
  } catch (error) {
    console.log("error", error);
  }
};

export default getRoom;
