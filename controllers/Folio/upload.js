import { uploadImageToS3 } from "../../helpers/helper.js"
import folio from "../../models/folio.js"
import Randomstring from "randomstring"

export const uploadDetails = async (req, res) => {


    try {

        const { folioNo, propertyId, remark } = req.body

        let imageUrl = ""

        if (req.files['doc']) {
            imageUrl = await uploadImageToS3(req.files['doc'][0]);

            await folio.findOneAndUpdate(
                { folioNo: folioNo, propertyId },
                {
                    $push: {
                        document: {
                            $each: [{
                                fileName: imageUrl,
                                remark: remark,
                                logId: Randomstring.generate(7)
                            }],
                            $position: 0
                        }
                    }
                }
            )

            return res.status(200).json({ message: "file Uploaded successfully", statuCode: 200 })

        }





    } catch (err) {
        return res.status(500).json({ message: "something wrong", statuCode: 500 })
    }



}