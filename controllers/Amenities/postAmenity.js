import Randomstring from "randomstring";
import * as dotenv from "dotenv";
dotenv.config();
import verifiedUser from "../../models/verifiedUsers.js";
import amenityModel from "../../models/amenity.js";
import { getCurrentUTCTimestamp, findUserByUserIdAndToken } from "../../helpers/helper.js";

const postAmenity = async (req, res) => {
   try {

      const { userId } = req.query;
      const authCodeValue = req.headers['authcode']

      const result = await findUserByUserIdAndToken(userId, authCodeValue);

      if (result.success) {
         const {
            shortCode,
            amenityName,
            propertyId,
            amenityType,
            amenityIcon,
            amenityIconLink
         } = req.body;

         const findUser = await verifiedUser.findOne({ userId })
         if (findUser) {
            let userRole = findUser.role[0].role
            const newAmenity = new amenityModel({
               propertyId,
               createdBy: userRole,
               createdOn: await getCurrentUTCTimestamp(),
               modifiedBy: [],
               modifiedOn: [],
               amenityId: Randomstring.generate(8),
               amenityName: [
                  {
                     amenityName: amenityName
                  }
               ],
               shortCode: [
                  {
                     shortCode: shortCode
                  }
               ],

               amenityType: [{
                  amenityType: amenityType
               }],
               amenityIcon: [{
                  amenityIcon: amenityIcon
               }],
               amenityIconLink: [{
                  amenityIconLink
               }]

            });
            await newAmenity.save();
            return res.status(200).json({ message: "New amenity added successfully", statuscode: 200 });
         } else {
            return res.status(404).json({ message: "amenity not found", statuscode: 404 });
         }
      } else {
         return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
      }
   } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
   }
};

export default postAmenity;