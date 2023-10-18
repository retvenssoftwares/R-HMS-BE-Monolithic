import Randomstring from "randomstring";
import * as dotenv from "dotenv";
dotenv.config();
import seasonModel from "../../models/season.js";

const postSeason = async (req, res) => {
       try{
      const {
        propertyId,
        seasonId,
        seasonName,
        startDate,
        endDate,
        createdBy,
        createdOn,
        modifiedBy,
        modifiedOn,
        days,

      } = req.body;

      const newSeason = new seasonModel({
            
        propertyId,
        seasonId : Randomstring.generate(8),
        seasonName : [{
            seasonName : seasonName
        }],
        startDate : [{
            startDate : startDate
        }],
        endDate : [{
            endDate : endDate
        }],
        createdBy,

        createdOn,

        modifiedBy : [

        ],
        modifiedOn : [
               
        ],
        days,
        
      });
      await newSeason.save();
      return res.status(200).json({ message: "New season added successfully", statuscode: 200 });

       } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error", statuscode: 500 }); 
}    
};

export default postSeason;