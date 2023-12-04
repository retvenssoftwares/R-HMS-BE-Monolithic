import lostAndFoundModel from "../../models/lostAndFound.js";
import randomString from "randomstring";
import verifiedUser from "../../models/verifiedUsers.js";
import {  getCurrentUTCTimestamp,
    findUserByUserIdAndToken,uploadImageToS3}from "../../helpers/helper.js";


    const patchlostAndFound = async (req,res) =>{
        try{
            const {lostAndFoundId } = req.params;
            const{
                userId,
                claimantName,
                contact,
                proofOfOwnership,
                imageProof,
            } = req.body

            const findUser = await verifiedUser.findOne({ userId });
            if (!findUser || !userId) {
                return res
                  .status(404)
                  .json({ message: "User not found or invalid userId", statuscode: 404 });
              }
              const authCodeValue = req.headers["authcode"];
              const result = await findUserByUserIdAndToken(userId, authCodeValue);

              if(result.success){
                const findFoundData= await lostAndFoundModel.findOne({ lostAndFoundId: lostAndFoundId });  
                if (!findFoundData) {
                    return res.status(404).json({ message: "Enter valid lostAndFoundId", statuscode: 404 });
                  }
                  
                  let imageUrl = "";
                  if (req.files["imageProof"]) {
                    imageUrl = await uploadImageToS3(req.files["imageProof"][0]);
                    // console.log(456)
                    const imageProofObject = {
                        imageProof: imageUrl,
                      logId: randomString.generate(10),
                    };
                    findFoundData.imageProof.unshift(imageProofObject);
                  }

                  if (claimantName) {
                    const claimantNameObject = {
                        claimantName: claimantName,
                      logId: randomString.generate(10),
                    };
                    findFoundData.claimantName.unshift(claimantNameObject);
                }
                if (contact) {
                    const contactObject = {
                        contact: contact,
                      logId: randomString.generate(10),
                    };
                    findFoundData.contact.unshift(contactObject);
                }
                if (proofOfOwnership) {
                    const proofOfOwnershipObject = {
                        proofOfOwnership: proofOfOwnership,
                      logId: randomString.generate(10),
                    };
                    findFoundData.proofOfOwnership.unshift(proofOfOwnershipObject);
                }

                findFoundData.claimStatus = "claimed";

              const updatedfindFoundData = await findFoundData.save();

               return res.status(200).json({message:"found data updated successfully",statuscode: 200})
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
    export default patchlostAndFound