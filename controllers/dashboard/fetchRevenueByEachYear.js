import bookingModel from "../../models/confirmBooking.js";

const RevenueData = async (req, res) => {
    const { propertyId, year } = req.query;

    try {
        const revenueData = await bookingModel.aggregate([
            {
                $match: {
                    "propertyId": propertyId,
                    "checkInDate.checkInDate": {
                        $regex: new RegExp(`^${year}`),
                    },
                },
            },
            {
                $unwind: "$reservationRate",
            },
            {
                $unwind: "$reservationRate.roomCharges",
            },
            {
                $project: {
                    month: { $substr: ["$reservationRate.roomCharges.from", 5, 2] },
                    grandTotal: { $toDouble: "$reservationRate.roomCharges.grandTotal" },
                },
            },
            {
                $group: {
                    _id: "$month",
                    totalRevenue: { $sum: "$grandTotal" },
                },
            },
            {
                $sort: { _id: 1 },
            },
        ]);

        res.status(200).json(revenueData);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
    }
};

export default RevenueData;
