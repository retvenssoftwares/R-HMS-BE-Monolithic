import Randomstring from "randomstring";
import * as dotenv from "dotenv";
dotenv.config();
import amenityModel from "../../models/superAdmin/amenities.js";
import { uploadImageToS3 } from "../../helpers/helper.js";

const createAmenity = async (req, res) => {
   try {
      const {
         amenityName,
         amenityType,
      } = req.body;

      var imageUrl = ""

      if (req.files['amenityIcon']) {
         imageUrl = await uploadImageToS3(req.files['amenityIcon'][0]);
     }
            const newAmenity = new amenityModel({
               amenityId: Randomstring.generate(8),
               amenityName: [
                  {
                     amenityName: amenityName
                  }
               ],
               amenityType: [{
                  amenityType: amenityType
               }],
               amenityIconLink: [{
                  amenityIconLink : imageUrl
               }]

            });
            await newAmenity.save();
            return res.status(200).json({ message: "New amenity added successfully", statuscode: 200 });
      
   } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
   }
};

export default createAmenity;