import guestDetails from "../../models/guestDetails.js";
import { findUserByUserIdAndToken } from "../../helpers/helper.js";

const guestData = async (req, res) => {
  try {
    const { userId } = req.query;

    const authCodeValue = req.headers['authcode']
    const result = await findUserByUserIdAndToken(userId, authCodeValue)
    if (result.success) {
    const findGuestId = await guestDetails.findOne({guestId:guestId}).lean();

    if(!findGuestId){
    return res.status(404).json({message: "No Guest found", statusCode:404}); 
    }

    // if (findGuestId.length > 0 ) {
    //   const foundData = findGuestId.map((guestData) => {
    //     return{
    //       ...guestData._doc,
    //       GuestId:guestData.guestId || "",
    //     }
    //   })
    //   return res.status(200).json({data:foundData,statuscode:200});

    // } else {
    //   res.status(404).json({ message: "No Guest found", status: 404 });
    // }
  }else {
    return res.status(result.statuscode).json({ message: findGuestId, statuscode: result.statuscode });
}
  } catch (error) {
    console.log("error", error);
  }
};

export default guestData;
