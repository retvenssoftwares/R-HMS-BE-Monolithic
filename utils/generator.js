import { format, utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";

function convertTimestampToCustomFormat(utcTimestamp, targetTimeZone) {
  // Convert the UTC timestamp to the target time zone
  const zonedTimestamp = utcToZonedTime(utcTimestamp, targetTimeZone);

  // Define the custom format
  const customFormat = "dd/MM/yy HH:mm:ss";

  // Format the zoned timestamp into the custom format
  const formattedTimestamp = format(zonedTimestamp, customFormat, {
    timeZone: targetTimeZone,
  });

  return formattedTimestamp;
}

// Example usage:
const utcTimestamp = "2023-10-16T17:18:48.845Z";
const targetTimeZone = "America/New_York"; // Change to the desired time zone

const formattedTimestamp = convertTimestampToCustomFormat(utcTimestamp, targetTimeZone);
console.log(formattedTimestamp);

function getCurrentUTCTimestamp() {
    const now = new Date();
    const utcTimestamp = now.toISOString();
    return utcTimestamp;
  }
  
  // Example usage:
  const currentUTC = getCurrentUTCTimestamp();
  console.log(currentUTC);
