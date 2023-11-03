import Randomstring from "randomstring";
import * as dotenv from "dotenv";
dotenv.config();
import amenityModel from "../../models/superAdmin/amenities.js";

const createAmenity = async (req, res) => {
   try {
      const {
         amenityName,
         amenityType,
         amenityIconLink
      } = req.body;

     
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
                  amenityIconLink
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