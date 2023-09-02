require('dotenv').config()
const crypto = require('crypto')
const userModel = require('../../models/Users/hotelOwnerRegister')
const key = process.env.key
const IV_LENGTH = process.env.iv

//Login module
exports.userLogin = async (req, res) => {
    let loginAttempts = 0
    const userId = req.params.userId;
    const userProfileId = await userModel.findOne({ userId: userId })
    if (!userProfileId) {
        return res.status(404).json({ message: "User not found" });
    }

    const { userName, password, genVariable } = req.body;
    const userProfile = await userModel.findOne({ userName: userName });
    if (!userProfile) {
        return res.status(404).json({ message: "Invalid credentials" });
    }

    const userPassword = userProfileId.password[0].password


    //create gen variable
    const mobile = userProfile.mobile

    const namePrefix = userName.slice(0, 4);
    const mobileSuffix = mobile.slice(-4);
    const generatedVariable = namePrefix + mobileSuffix;

    if (generatedVariable !== genVariable || genVariable === '') {
        return res.json({ message: "Gen variable is invalid" })
    }

    // Encrypt function
    // function encryptPassword(text) {
    //     const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), Buffer.from('16digitivexample'));
    //     let encrypted = cipher.update(text, 'utf8', 'hex');
    //     encrypted += cipher.final('hex');
    //     return encrypted;
    //   }
    //   const encryptedPassword = encryptPassword(password)

    // Decrypt function
    function decryptPassword(encryptedText) {
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), Buffer.from(IV_LENGTH));
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }

    const decryptedPassword = decryptPassword(userPassword)
    console.log(decryptedPassword)

    const dateObject = new Date();
    const hours = dateObject.getHours();
    console.log("hours:", hours);

    // Add three hours to the current time
    let blockHours = (hours + 3) % 24;
    console.log(blockHours);

    // Assuming userProfile.blockedUntil is the field that stores the time until which the user is blocked
    const blockedUntil = userProfile.blockedUntil;
    console.log("blocked until:", blockedUntil)
    console.log("blockhours:", blockHours)
    const count = userProfile.loginAttempts;
    console.log("count", count)

    // Get the current time in hours
    const currentHours = new Date().getHours();

    // Check if the user is blocked and the block time has passed
    if (blockedUntil && blockedUntil <= currentHours) {
        // Reset the blockedUntil and loginAttempts fields
        await userModel.updateOne({ _id: userProfile._id }, { $set: { blockedUntil: 0, loginAttempts: 0 } });
    }

    if (blockedUntil && blockedUntil > currentHours) {
        return res.status(429).json({ message: "Too many login attempts, please try again after 3 hours" });
    } else {
        if (decryptedPassword !== password) {
            const loginCount = await userModel.updateOne({ _id: userProfile._id }, { $inc: { loginAttempts: 1 } });

            // Check if loginAttempts reached 5 and block the user
            if (count >= 4 ) {
                const newBlockedUntil = (currentHours + 3) % 24;
                await userModel.updateOne({ _id: userProfile._id }, { $set: { blockedUntil: newBlockedUntil, loginAttempts: 0 } });
                return res.status(429).json({ message: "Too many login attempts, please try again after 3 hours" });
            } else {
                return res.status(400).json({ message: 'Invalid credentials' });
            }
        } else {         
            // Reset blockedUntil when login is successful
            await userModel.updateOne({ _id: userProfile._id }, { $set: { blockedUntil: 0, loginAttempts: 0 } });
            const registrationId = crypto.randomBytes(64).toString('hex');
            await userModel.updateOne({ userId: userId }, { $set: { registrationId: registrationId } });
            res.status(200).json({ message: 'Login successful', registrationId: registrationId });
        }
    }
}

//Logout module
exports.userLogout = async (req, res) => {
    const userId = req.params.userId;
    const userProfile = await userModel.findOne({ userId: userId });

    //ask to login again if registrationid is empty
    if (userProfile.registrationId === null || userProfile.registrationId === '') {
        return res.status(400).json({ message: "Please login again" })
    }
    await userModel.updateOne({ userId: userId }, { $set: { registrationId: '' } });
    res.status(200).json({ message: 'Logged out successfully' })
}