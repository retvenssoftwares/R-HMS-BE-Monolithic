import folio from "../../models/folio.js"

export const voidFolio = async (req, res) => {
    const { folioNo, propertyId, referenceNo, reasons } = req.body;

    const folioDetails = await folio.findOne({ folioNo: folioNo, propertyId });

    if (!folioDetails) {
        return res.status(404).json({ message: "Folio not found", statusCode: 404 });
    }

    const hasMatchingRecord = folioDetails.folioRecords.filter((record) => referenceNo.includes(record.refNo));

    hasMatchingRecord.forEach(async (item) => {
        if (item.totalCharges) {

            await folio.findOneAndUpdate(
                { "folioRecords.refNo": item.refNo, folioNo: folioNo },
                {

                    // here we subtracting the totalCharges beacuse they are stored in + sign
                    $inc: {
                        totalBalance: -item.totalCharges
                    },

                    $set: {
                        "folioRecords.$.voidStatus": "true",
                    },

                    $set: {
                        "folioRecords.$.reasons": reasons,
                    }
                },
                { new: true }
            );

        } else if (item.paymentAmount) {
            await folio.findOneAndUpdate(
                { "folioRecords.refNo": item.refNo, folioNo: folioNo },
                {

                    // here we subtracting the totalCharges beacuse they are stored in + sign
                    $inc: {
                        totalBalance: -item.paymentAmount
                    },

                    $set: {
                        "folioRecords.$.voidStatus": "true",
                    },

                    $set: {
                        "folioRecords.$.reasons": reasons,
                    }
                },
                { new: true }
            );
        } else if (item.discountAmount || item.discountPercentage) {
            await folio.findOneAndUpdate(
                { "folioRecords.refNo": item.refNo, folioNo: folioNo },
                {
                    // here we subtracting the totalCharges beacuse they are stored in + sign
                    $inc: {
                        totalBalance: -item.discountAmount || 0,
                        ...(item.discountPercentage && { totalBalance: -item.discountPercentage }),
                    },

                    $set: {
                        "folioRecords.$.voidStatus": "true",
                    },

                    $set: {
                        "folioRecords.$.reasons": reasons,
                    }
                },
                { new: true }
            );
        } else if (item.adjustmentAmount) {
            let adjustment = 0
            if (item.adjustmentAmount.startsWith("-")) {
                adjustment = item.adjustmentAmount
            } else {
                adjustment = item.adjustmentAmount
            }

            await folio.findOneAndUpdate(
                { "folioRecords.refNo": item.refNo, folioNo: folioNo },
                {
                    // here we subtracting the totalCharges beacuse they are stored in + sign
                    $inc: {
                        totalBalance: -adjustment,
                    },

                    $set: {
                        "folioRecords.$.voidStatus": "true",
                    },

                    $set: {
                        "folioRecords.$.reasons": reasons,
                    }
                },
                { new: true }
            );
        }


    })

}