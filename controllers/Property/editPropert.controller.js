import Randomstring from "randomstring";
import * as dotenv from "dotenv";
dotenv.config();
import propertyModel from "../../models/property.js";
import {
  getCurrentUTCTimestamp,
  uploadImageToS3,
} from "../../helpers/helper.js";

const editProperty = async (req, res) => {
    const filter = { propertyId: req.body.propertyId };
  
    const newData = {
      propertyName: req.body.propertyName,
  
    };
  
    const time = await getCurrentUTCTimestamp()
    console.log(time)
  
    const updateFields = {
      starCategory: req.body.starCategory,
      roomsInProperty: req.body.roomsInProperty,
      taxName: req.body.taxName,
      registrationNumber: req.body.registrationNumber,
      ratePercent: req.body.ratePercent,
      $push: {
        propertyName: {
          $each: [
            {
              propertyName: newData.propertyName,
              // Add other fields you need for the new object
              modifiedDate : time
            }
          ],
          $position: 0,
        },
      },
    };
  
    const options = {
      new: true, // Return the modified document
    };
  
  
    try {
      // First, update the non-array fields
     
  
      // Then, update the array field
      const updatedDocument = await propertyModel.findOneAndUpdate(filter, updateFields, options);
  
      if (!updatedDocument) {
        return res.status(404).json({ message: 'Document not found' });
      }
      res.json(updatedDocument);
    } catch (error) {
      console.error('Update error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  

export default editProperty