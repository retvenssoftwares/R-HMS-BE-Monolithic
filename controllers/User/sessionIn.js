import verifiedUser from "../../models/verifiedUsers.js"
import crypto from "crypto";
import {decrypt} from "../../helpers/helper.js"

export const sessionIn = async (req, res) => {
    try {
      const { userId, deviceType , password} = req.body;

      if(!userId || !deviceType){
        return res.status(404).json({ message: "enter the filed correctly" , statusCode : 404});
      }

      const user = await verifiedUser.findOne({ userId });

      if(!user){
        return res.status(404).json({ message: "user not found" , statusCode : 404});
      }
  
      const original = decrypt(user.password[0].password);

      if(original === password){

        const tokenArray = user.token;
        
        const token = crypto.randomBytes(64).toString("hex");
    
        // Push the object containing the token and deviceType into tokenArray
        tokenArray.push({ token: token, deviceType: deviceType });
    
        // Save the updated tokenArray to the user document
        await user.save();
    
        return res.status(200).json({ message: "Token added successfully" , statusCode : 200});
      }else{
        return res.status(401).json({ message: "enter the valid password" , statusCode : 401});
      }

      
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server error", statusCode: 500 });
    }
  };
  
