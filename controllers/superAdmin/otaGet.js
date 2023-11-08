import otaModel from "../../models/superAdmin/otaModel.js";

const getOta = async (req, res) => {
        try{
           
        const otaData = await otaModel.find({}).lean();
        if (otaData.length > 0) {
            const otaDetails = otaData.map(otas => {
                return {
                    ...otas._doc,
                    otaId: otas.otaId[0].otaId || '',
                    otaName: otas.otaName[0].otaName || '',
                    otaLogo: otas.otaLogo[0].otaLogo || '',
                    isConfig:otas.isConfig
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
