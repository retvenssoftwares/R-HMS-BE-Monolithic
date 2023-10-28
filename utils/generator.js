// Import the Mongoose model
import verifiedUser from '../models/verifiedUsers.js';

// Create a helper function
async function findUserByUserIdAndToken(userId, token) {
    try {
        // Find the user by userId
        const user = await verifiedUser.findOne({ userId });

        if (!user) {
            // User not found
            return null;
        }

        // Check if the token exists in the token array
        const tokenExists = user.token.some((userToken) => userToken.token === token);

        if (tokenExists) {
            return user;
        } else {
            // Token not found in the user's tokens
            return null;
        }
    } catch (error) {
        // Handle errors here
        console.error('Error finding user:', error);
        throw error;
    }
}

// Usage example:
const userId = '3BPNQz9A';
const providedToken = '70460de21252cd61810a9e5741d874ea6598eb8b9f428dc076c141e6377a5b77d2acb5e7d09bb5a4b7424dd6cb39ad17010df7c791871c4e56c92cae45b6d0d0';

findUserByUserIdAndToken(userId, providedToken)
    .then((user) => {
        if (user) {
            console.log('User found:', user);
        } else {
            console.log('User not found or token does not match.');
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
