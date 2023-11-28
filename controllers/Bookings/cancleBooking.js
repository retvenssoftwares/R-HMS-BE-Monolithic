import confirmBooking from "../../models/confirmBooking.js";
import cancleBookingDetails from "../../models/cancleBooking.js";

export const cancelBooking = async (req, res) => {
  const { reservationIds } = req.body;

  try {
    const detailsPromises = reservationIds.map(async (item) => {
      // Find the document and include the version (__v) in the query
      const existingDocument = await confirmBooking.findOne({ reservationId: item }).lean();

      if(!existingDocument){
        return res.status(404).json({message:"Data not found", statusCode : 404})
      }

      if (existingDocument) {
        // Create a new document in the cancleBookingDetails collection
        const newDocumentForCancellation = new cancleBookingDetails(existingDocument);

        // Save the new document to the cancleBookingDetails collection
        await newDocumentForCancellation.save();

      } else {
        return res.status(404).json({message:"something wrong", statusCode:404})
      }

      await confirmBooking.deleteOne({reservationId: item})
    });

    // Wait for all promises to resolve
    const data = await Promise.all(detailsPromises);

    if(data){
      return res.status(200).json({message : "Documents updated successfully" , statusCode : 200})
    }

    

    
  } catch (error) {
    console.error("Error updating documents and saving to another collection:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
