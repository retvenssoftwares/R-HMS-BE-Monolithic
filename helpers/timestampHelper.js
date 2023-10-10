function getCurrentUTCTimestamp() {
    const now = new Date();
    const utcTimestamp = Math.floor(now.getTime() / 1000); // Convert to seconds
    return utcTimestamp;
  }

  export default getCurrentUTCTimestamp