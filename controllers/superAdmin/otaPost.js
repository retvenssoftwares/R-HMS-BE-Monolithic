import otaModel from "../../models/superAdmin/otaModel.js";
import {getCurrentUTCTimestamp, findUserByUserIdAndToken,uploadImageToS3,} from "../../helpers/helper.js";

export const newOta = async (req, res) => {
  try {
    const {otaId, otaName} = req.body;
    var imageUrl="";

    if (req.files['otaLogo']) {
        imageUrl = await uploadImageToS3(req.files['otaLogo'][0]);
        console.log(imageUrl)
    }

        const ota = new otaModel( {
          
            otaName: [{
                otaName: otaName,
            }],

            otaId :[{
                otaId:otaId
            }],

            otaLogo :[{
                otaLogo : imageUrl
            }],
            createdOn:await getCurrentUTCTimestamp()
  })

        await ota.save();
        return res.status(200).json({ message: 'ota Successfully added' , statusCode : 200 })

  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Failed to create OTA" });
  }
};
