import companyRatePlane from "../../models/companyRatePlane.js";

const getCompanyRatePlan = async (req, res) => {
        try{
            const roomTypeId=req.query;
           
        const companyRateData = await companyRatePlane.find(roomTypeId).lean();
        if (companyRateData.length > 0) {
            const rateDetails = companyRateData.map(rates => {
                return {
                    ...rates._doc,
                    companyRatePlanId: rates.companyRatePlanId || '',
                    companyRatePlanName: rates.ratePlanName[0].ratePlanName || '',
                };

            });

            return res.status(200).json({ data: rateDetails, statuscode: 200 });
        } else {
            return res.status(404).json({ message: "No data found", statuscode: 404 });
        }

        }catch (error) {
            console.log(error);
        return res.status(500).json({ message: error.message, statusCode: 500 });
    }
};

export default getCompanyRatePlan;
