// Function to get the current UTC timestamp
async function getCurrentUTCTimestamp() {
    const now = new Date();
    const utcTimestamp = now.toISOString(); // Convert to ISO string
    return utcTimestamp;
}

// Function to calculate the timestamp for 15 minutes ago
async function getTimestamp15MinutesAgo() {
    const currentTimestamp = new Date(await getCurrentUTCTimestamp());
    const fifteenMinutesAgo = new Date(currentTimestamp.getTime() - 15 * 60 * 1000); // Subtract 15 minutes in milliseconds
    const fifteenMinutesAgoTimestamp = fifteenMinutesAgo.toISOString();
    return fifteenMinutesAgoTimestamp;
}

// Usage example
getTimestamp15MinutesAgo().then(async (timestamp) => {
    console.log("Current UTC Timestamp:", await getCurrentUTCTimestamp());
    console.log("15 Minutes Ago UTC Timestamp:", timestamp);
});
