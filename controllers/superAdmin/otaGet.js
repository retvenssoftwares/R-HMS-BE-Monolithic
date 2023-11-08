import otaModel from "../../models/superAdmin/otaModel.js";

const getOta = async (req, res) => {
        try{
            const { otaId } = req.query;
        const otaData = await otaModel.find({ "otaId.otaId":otaId }).lean();
        if (otaData.length > 0) {
            const otaDetails = otaData.map(otas => {
                return {
                    ...otas._doc,
                    otaId: otas.otaId[0] || '',
                    otaName: otas.otaName[0] || '',
                    otaLogo: otas.otaLogo[0] || '',
                };

            });

            return res.status(200).json({ data: otaDetails, statuscode: 200 });
        } else {
            return res.status(404).json({ message: "No ota found", statuscode: 404 });
        }

        }catch (error) {
            console.log(error);
        return res.status(500).json({ message: error.message, statusCode: 500 });
    }
};

export default getOta;
