import folio from "../../models/folio.js";

export const splitFolio = async (req, res) => {
    const { folioNo, transferFolioNo, propertyId, referenceNo } = req.body;

    try {
        const folioDetails = await folio.findOne({ folioNo: folioNo, propertyId });

        if (!folioDetails) {
            return res.status(404).json({ message: "Folio not found", statusCode: 404 });
        }

        const hasMatchingRecord = folioDetails.folioRecords.filter((record) => referenceNo.includes(record.refNo));

        if (!hasMatchingRecord || hasMatchingRecord.length === 0) {
            return res.status(404).json({ message: "Data not found", statusCode: 404 });
        }


        hasMatchingRecord.forEach(async (item) => {
            if (item.totalCharges) {
                console.log("h")
                const transferFolioDetails = await folio.findOneAndUpdate(
                    { folioNo: transferFolioNo },
                    {

                        // here no need to add - sign to beacome - and - to + because charges are alredy in + sign
                        $inc: {
                            totalBalance: item.totalCharges,
                        },
                        $push: {
                            folioRecords: {
                                $each: [{
                                    date: new Date(),
                                    particular: item.particular || "",
                                    refNo: item.refNo || "",
                                    user: item.user || "",
                                    discountType: item.discountType || "",
                                    discountPercentage: item.discountPercentage || "",
                                    discountAmount: item.discountAmount || "",
                                    adjustmentFor: item.adjustmentFor || "",
                                    adjustmentAmount: item.adjustmentAmount || "",
                                    paymentType: item.paymentType || "",
                                    paymentMethod: item.paymentMethod || "",
                                    paymentAmount: item.paymentAmount || "",
                                    chagreType: item.chagreType || "",
                                    chargeRule: item.chargeRule || "",
                                    rate: item.rate || "",
                                    totalCharges: item.totalCharges || "",
                                    quantity: item.quantity || "",
                                    narration: item.narration || "",
                                    logId: item.logId || "",
                                }],
                                $position: 0,
                            },
                        },
                        $set: {
                            transferedFolioFrom: transferFolioNo,
                        },
                    },
                    { new: true }
                );

                await folio.findOneAndUpdate(
                    //{ "folioRecords.refNo": item.refNo, folioNo: folioNo },
                    {folioNo: folioNo },
                    {

                        // here we subtracting the totalCharges beacuse they are stored in + sign
                        $inc: {
                            totalBalance: -item.totalCharges
                        },

                        // $set: {
                        //     "folioRecords.$.voidStatus": "true",
                        // }
                    },
                    { new: true }
                );
            } else if (item.paymentAmount) {
                console.log("p")
                const transferFolioDetails = await folio.findOneAndUpdate(
                    { folioNo: transferFolioNo },
                    {
                        // payment are store in - so here no need to add - it will automatically subtract the amount from total
                        $inc: {
                            totalBalance: item.paymentAmount,
                        },
                        $push: {
                            folioRecords: {
                                $each: [{
                                    date: new Date(),
                                    particular: item.particular || "",
                                    refNo: item.refNo || "",
                                    user: item.user || "",
                                    discountType: item.discountType || "",
                                    discountPercentage: item.discountPercentage || "",
                                    discountAmount: item.discountAmount || "",
                                    adjustmentFor: item.adjustmentFor || "",
                                    adjustmentAmount: item.adjustmentAmount || "",
                                    paymentType: item.paymentType || "",
                                    paymentMethod: item.paymentMethod || "",
                                    paymentAmount: item.paymentAmount || "",
                                    chagreType: item.chagreType || "",
                                    chargeRule: item.chargeRule || "",
                                    rate: item.rate || "",
                                    totalCharges: item.totalCharges || "",
                                    quantity: item.quantity || "",
                                    narration: item.narration || "",
                                    logId: item.logId || "",
                                }],
                                $position: 0,
                            },
                        },
                        $set: {
                            transferedFolioFrom: transferFolioNo,
                        },
                    },
                    { new: true }
                );

                await folio.findOneAndUpdate(
                    // { "folioRecords.refNo": item.refNo, folioNo: folioNo },
                    {folioNo: folioNo },
                    {

                        // here we use - sign to become - - = + because paymentAm in - and we adding one more to puls the subtracted amount from total
                        $inc: {
                            totalBalance: -item.paymentAmount
                        },

                        // $set: {
                        //     "folioRecords.$.voidStatus": "true",
                        // }
                    },
                    { new: true }
                );
            } else if (item.discountAmount || item.discountPercentage) {
                console.log("d")
                const transferFolioDetails = await folio.findOneAndUpdate(
                    { folioNo: transferFolioNo },
                    {
                        // here we not used - sign to subtract the discount from  totalAmount beacuse discount are already in - sign
                        $inc: {
                            totalBalance: item.discountAmount || 0,
                            ...(item.discountPercentage && { totalBalance: item.discountPercentage }),
                        },
                        $push: {
                            folioRecords: {
                                $each: [{
                                    date: new Date(),
                                    particular: item.particular || "",
                                    refNo: item.refNo || "",
                                    user: item.user || "",
                                    discountType: item.discountType || "",
                                    discountPercentage: item.discountPercentage || "",
                                    discountAmount: item.discountAmount || "",
                                    adjustmentFor: item.adjustmentFor || "",
                                    adjustmentAmount: item.adjustmentAmount || "",
                                    paymentType: item.paymentType || "",
                                    paymentMethod: item.paymentMethod || "",
                                    paymentAmount: item.paymentAmount || "",
                                    chagreType: item.chagreType || "",
                                    chargeRule: item.chargeRule || "",
                                    rate: item.rate || "",
                                    totalCharges: item.totalCharges || "",
                                    quantity: item.quantity || "",
                                    narration: item.narration || "",
                                    logId: item.logId || "",
                                }],
                                $position: 0,
                            },
                        },
                        $set: {
                            transferedFolioFrom: transferFolioNo,
                        },
                    },
                    { new: true }
                );

                await folio.findOneAndUpdate(
                    // { "folioRecords.refNo": item.refNo, folioNo: folioNo },
                    {folioNo: folioNo },
                    {

                        // here we use - - = + so that the discount will maitain the total balace and add the given dicount amount gaing because it has transfered to another folio
                        $inc: {
                            totalBalance: -item.discountAmount || 0,
                            ...(item.discountPercentage && { totalBalance: -item.discountPercentage }),
                        },

                        // $set: {
                        //     "folioRecords.$.voidStatus": "true",
                        // }
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
                console.log("a")
                const transferFolioDetails = await folio.findOneAndUpdate(
                    { folioNo: transferFolioNo },
                    {
                        $inc: {
                            totalBalance: adjustment,
                        },
                        $push: {
                            folioRecords: {
                                $each: [{
                                    date: new Date(),
                                    particular: item.particular || "",
                                    refNo: item.refNo || "",
                                    user: item.user || "",
                                    discountType: item.discountType || "",
                                    discountPercentage: item.discountPercentage || "",
                                    discountAmount: item.discountAmount || "",
                                    adjustmentFor: item.adjustmentFor || "",
                                    adjustmentAmount: item.adjustmentAmount || "",
                                    paymentType: item.paymentType || "",
                                    paymentMethod: item.paymentMethod || "",
                                    paymentAmount: item.paymentAmount || "",
                                    chagreType: item.chagreType || "",
                                    chargeRule: item.chargeRule || "",
                                    rate: item.rate || "",
                                    totalCharges: item.totalCharges || "",
                                    quantity: item.quantity || "",
                                    narration: item.narration || "",
                                    logId: item.logId || "",
                                }],
                                $position: 0,
                            },
                        },
                        // $set: {
                        //     transferedFolioFrom: transferFolioNo,
                        // },
                    },
                    { new: true }
                );

                await folio.findOneAndUpdate(
                    // { "folioRecords.refNo": item.refNo, folioNo: folioNo },
                    {folioNo: folioNo },
                    {
                        $inc: {
                            totalBalance: -adjustment,
                        },
                        // $set: {
                        //     "folioRecords.$.voidStatus": "true",
                        // }
                    },
                    { new: true }
                );
            }
        });


        return res.status(200).json({ message: "Matching record pushed successfully", statusCode: 200 });


    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", statusCode: 500 });
    }
};
