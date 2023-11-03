import amenityIcon  from "../../models/superAdmin/amenityIcon.js";
import {uploadImageToS3} from "../../helpers/helper.js"
import Randomstring from "randomstring";

const postAmenityIcon = async (req, res) => {
    try {
        const {amenityIconTags}=req.body
      // Check if 'amenityIcon' files are included in the request
      if (req.files && req.files["amenityIcon"]) {
        const amenityIconUrls = [];
  
        for (const icon of req.files["amenityIcon"]) {
          // Upload the icon to your desired location (e.g., S3)
          const imageUrl = await uploadImageToS3(icon);
   // Split the input string of tags by commas
   const tagsArray = amenityIconTags.split(",").map(tag => tag.trim());
          // Create a new amenity icon document based on the schema
          const newAmenityIcon = new amenityIcon({
            amenityIconId: Randomstring.generate(8), // Generate a unique ID
            amenityIconLink: imageUrl,
            amenityIconTags:tagsArray
          });
  
          // Save the new amenity icon document to the database
          const savedAmenityIcon = await newAmenityIcon.save();
  
         // amenityIconUrls.push(savedAmenityIcon); // Store the saved document in the array
        }
  
        // Respond with the uploaded amenity icons
        return res.status(200).json({
          message: "Amenity icons uploaded successfully",
         // amenityIcons: amenityIconUrls,
        });
      } else {
        return res.status(400).json({ message: "No amenity icons found in the request" });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error", statuscode: 500 });
    }
  };
  
  export default postAmenityIcon;