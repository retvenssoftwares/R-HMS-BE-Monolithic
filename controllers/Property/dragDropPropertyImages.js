import propertyImages from '../../models/propertyImages.js'

const dragDropPropertyImages = async (req, res) => {

    try {

        const { propertyId } = req.query;
        const findRecord = await propertyImages.findOne({ propertyId })
        if (!findRecord) {
            return res.status(404).json({ message: "Property Record not found", statuscode: 404 })
        }
        x
        const startIndex = 1;
        const endIndex = 3;


        const [movedObject] = findRecord.propertyImages.splice(startIndex, 1);

        // Insert the object at the end index
        propertyImages.splice(endIndex, 0, movedObject);

        console.log(propertyImages);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 })
    }


}

export default dragDropPropertyImages;