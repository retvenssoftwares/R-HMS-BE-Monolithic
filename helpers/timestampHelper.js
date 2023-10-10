function getCurrentUTCTimestamp() {
  const now = new Date();
  const utcTimestamp = now.toISOString(); // Convert to ISO string
  return utcTimestamp;
}

export default getCurrentUTCTimestamp;