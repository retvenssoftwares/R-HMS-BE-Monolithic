import lostAndFoundModel from "../../models/lostAndFound.js";
import randomString from "randomstring";
import verifiedUser from "../../models/verifiedUsers.js";
import {  getCurrentUTCTimestamp,
    findUserByUserIdAndToken,
    uploadMultipleImagesToS3}from "../../helpers/helper.js";


    const lostAndFound = async (req,res) =>{
        try{
            const{
                userId,
                propertyId,
                itemImage,
                description,
                dateFound,
                foundBy,
                locationFound,
                StorageLocation

            } = req.body

            const findUser = await verifiedUser.findOne({ userId });
            if (!findUser || !userId) {
                return res
                  .status(404)
                  .json({ message: "User not found or invalid userId", statuscode: 404 });
              }
              const authCodeValue = req.headers["authcode"];
              const result = await findUserByUserIdAndToken(userId, authCodeValue);
              const currentUTCTime = await getCurrentUTCTimestamp();

              if(result.success){
              const role = findUser.role;
              const userRole = role[0].role;

              const itemImageFiles = req.files['itemImage']

              let multipleImage = [];

              
             if (itemImageFiles) {
                multipleImage = await uploadMultipleImagesToS3(itemImageFiles);
              }
              

              const addLostAndFound = new lostAndFoundModel({
                propertyId: propertyId,
                lostAndFoundId:randomString.generate(7),
                description:[{
                    description:description,
                    logId: randomString.generate(10),
                }],
                createdBy:userRole,
                createdOn:currentUTCTime,
                dateFound:[{
                    dateFound:dateFound,
                    logId: randomString.generate(10),

                }],
                foundBy:[{
                    foundBy:foundBy,
                    logId: randomString.generate(10),
                }],
                locationFound:[{
                    locationFound:locationFound,
                    logId: randomString.generate(10),
                }],
                StorageLocation:[{
                    StorageLocation:StorageLocation,
                    logId: randomString.generate(10),
                }],
                itemImage:multipleImage.map((image)=>({
                    itemImage:image,
                    logId:randomString.generate(10),
                }))
              })

              const companyData = await addLostAndFound.save();
               return res.status(200).json({message:"found data added successfully",statuscode: 200})
            }else {
                return res
                  .status(result.statuscode)
                  .json({ message: result.message, statuscode: result.statuscode });
              }


        }catch(error){
            console.log(error);
            return res.status(500).json({ message: "Internal Server Error", statuscode: 500 });

        }

    }
    export default lostAndFound