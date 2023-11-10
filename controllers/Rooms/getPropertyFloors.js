import floorData from "../../models/floor.js";
import { findUserByUserIdAndToken } from "../../helpers/helper.js";
const getFloors = async (req, res) => {
    try {
        const { userId, propertyId } = req.query
        const authCodeValue = req.headers['authcode']

        const result = await findUserByUserIdAndToken(userId, authCodeValue);

        if (result.success) {
            const getAllFloors = await floorData.find({ propertyId: propertyId });

            if (getAllFloors) {
                const floorDetails = getAllFloors.floorInHotel
                const mappedFloors = getAllFloors.map((floor) => {
                    return {
                        ...floor._doc,
                        roomId: floor.floorInHotel.roomId,
                        floorName: floor.floorInHotel.floorName[0].floorName || "",
                        roomsInFloor: floor.floorInHotel.roomsInFloor[0].roomsInFloor || "",
                    }
                })
                return res.status(200).json({ data: mappedFloors, statuscode: 200 })
            } else {
                return res.status(404).json({ message: "No floors found", statuscode: 404 })
            }
        }
        else {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 })
    }

}

export default getFloors