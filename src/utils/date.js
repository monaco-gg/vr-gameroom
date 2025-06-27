import cronParser from "cron-parser";

/**
 * Returns the date of the next day with the time set to midnight (00:00:00.000).
 *
 * @param {string} cronExpression - The cron expression in standard format (e.g., '0 12 * * *' for every day at 12:00 PM).
 * @returns {Date} A Date object representing the next day with time set to midnight.
 */
export function getNextCronExecutionDate(cronExpression) {

  const options = { currentDate: new Date(), utc: true };
  const interval = cronParser.parseExpression(cronExpression, options);
  
  const nextExecution = interval.next().toDate();

  return nextExecution;
}
