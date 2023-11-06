

const updateApiArray = async (apiname, propertyId, userProfileId, userId, ipAddress, deviceType) => {
    try {
      const updateResult = await apiname.updateOne(
        { propertyId: propertyId },
        {
          $push: {
            apiArray: {
              $each: [
                {
                  apiname: apiname,
                  role: userProfileId.role,
                  timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
                  userId: userId,
                  ipAddress: ipAddress,
                  deviceType: deviceType,
                },
              ],
              $position: 0,
            },
          },
        }
      );
  
      if (updateResult.modifiedCount === 1) {
        console.log("ApiArray updated successfully");
        return true;
      } else {
        console.log("ApiArray update failed");
        return false;
      }
    } catch (error) {
      console.error("An error occurred:", error);
      return false;
    }
  };
  
  // Example usage:
  
  // updateApiArray(apinameModel, propertyId, userProfileId, userId, ipAddress, deviceType);