import { findUserByUserIdAndToken } from '../../helpers/helper.js';
import propertyImages from '../../models/propertyImages.js'

const dragDropPropertyImages = async (req, res) => {

    try {
        const { propertyId, oldIndex, newIndex, userId } = req.query;

        // Find the document by ID
        const propertyImageDoc = await propertyImages.findOne({ propertyId });

        if (!propertyImageDoc) {
            return res.status(404).json({ message: "Property document not found", statuscode: 404 });
        }

        const authCodeValue = req.headers['authcode']

        const result = await findUserByUserIdAndToken(userId, authCodeValue);

        if (result.success) {
            // Ensure the oldIndex and newIndex are within bounds
            const targetArray = propertyImageDoc.propertyImages; // Get the specified array
            // console.log(targetArray)

            if (
                !targetArray || // Check if the specified array exists
                oldIndex < 0 ||
                oldIndex >= targetArray.length ||
                newIndex < 0 ||
                newIndex >= targetArray.length
            ) {
                return res.status(400).json({ message: "Invalid index values" });
            }

            // Remove the object from the oldIndex and insert it at the newIndex
            const [movedObject] = targetArray.splice(oldIndex, 1);
            targetArray.splice(newIndex, 0, movedObject);

            // Save the updated document
            await propertyImageDoc.save();

            return res.status(200).json({ message: "Index changed successfully" });
        }
        else {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }

}

export default dragDropPropertyImages;