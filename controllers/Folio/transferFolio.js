import folio from "../../models/folio.js";
import Randomstring from "randomstring";

export const transferFolio = async (req, res) => {
    const { folioNo, transferFolioNo, propertyId} = req.body;

    try {
        const folioDetails = await folio.findOne({ folioNo: folioNo, propertyId });

        if (!folioDetails) {
            return res.status(404).json({ message: "Folio not found", statusCode: 404 });
        }

        const hasMatchingRecord = folioDetails.folioRecords;

        if(!hasMatchingRecord){
            return res.status(404).json({message : "Data not found" , statusCode :404})
        }


        const amount = folioDetails.totalBalance
        let adjustedTotalBalance = parseFloat(amount);

        if (hasMatchingRecord.length > 0) {
            //adjustedTotalBalance = parseFloat(amount.startsWith('-') ? -parseFloat(hasMatchingRecord.totalBalance.substring(1)) : parseFloat(hasMatchingRecord.totalBalance));
            
            const transferFolioDetails = await folio.findOneAndUpdate(
                { folioNo: transferFolioNo },
                {
                    $inc:{
                        totalBalance : adjustedTotalBalance
                    },
                    $push: {
                        folioRecords: {
                            $each: [
                                {
                                    date: new Date(),  // Example additional field

                                    particular : `Folio transfered from ${folioNo}`,

                                    refNo : Randomstring.generate(10),

                                    totalCharges : adjustedTotalBalance
                                   
                                }
                            ],
                            $position: 0,
                        },
                    },

                },
                { new: true }
            );

            await folio.findOneAndUpdate(
                { folioNo: folioNo },
                {
                    $set: {
                        isTransfered : "true",
                        transferedFolio : transferFolioNo,
                        totalBalance : 0,
                        
                    }
                },
                { new: true }
            );

           
            if (transferFolioDetails) {
                return res.status(200).json({ message: "Matching record pushed successfully", statusCode: 200 });
            } else {
                return res.status(404).json({ message: "Transfer folio not found", statusCode: 404 });
            }
        } else {
            return res.status(404).json({ message: "No matching folio or referenceNos found", statusCode: 404 });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", statusCode: 500 });
    }
};
