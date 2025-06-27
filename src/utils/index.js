import moment from "moment";
import crypto from "crypto";
import request from "./api";

/**
 * Removes special characters from a string.
 *
 * @param {string|null} input - The string to clean.
 * @param {boolean} [removeSpaces=false] - If true, removes all spaces from the string.
 * @returns {string} The cleaned string.
 */
export function cleanString(input, removeSpaces = false) {
  if (!input) {
    return "";
  }

  // Remove special characters
  let cleanedString = input.replace(/[^\w\s]/gi, "");

  // Remove spaces if the second parameter is true
  if (removeSpaces) {
    cleanedString = cleanedString.replace(/\s+/g, "");
  }

  return cleanedString;
}

/**
 * Validate CPF number (Brazilian individual taxpayer registry identification).
 *
 * @param {string} cpf - The CPF number as a string, with or without punctuation.
 * @returns {boolean} - Returns true if the CPF is valid, false otherwise.
 */
export const validateCPF = (value) => {
  let cpf = value;

  if (cpf === "" || cpf === null || cpf === undefined) {
    return false;
  }

  // Remove any non-digit characters
  cpf = cpf.replace(/[^\d]/g, "");

  // CPF must have 11 digits
  if (cpf.length !== 11) return false;

  // Invalid CPF patterns
  const invalidCPF = [
    "00000000000",
    "11111111111",
    "22222222222",
    "33333333333",
    "44444444444",
    "55555555555",
    "66666666666",
    "77777777777",
    "88888888888",
    "99999999999",
  ];

  // Check for invalid CPF patterns
  if (invalidCPF.includes(cpf)) return false;

  // Validate first check digit
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let firstCheckDigit = 11 - (sum % 11);
  if (firstCheckDigit >= 10) firstCheckDigit = 0;
  if (firstCheckDigit !== parseInt(cpf.charAt(9))) return false;

  // Validate second check digit
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  let secondCheckDigit = 11 - (sum % 11);
  if (secondCheckDigit >= 10) secondCheckDigit = 0;
  if (secondCheckDigit !== parseInt(cpf.charAt(10))) return false;

  return true;
};

/**
 * Checks if the user agent is from a mobile device.
 * @param {string} userAgent - The user agent string.
 * @returns {boolean} - True if the user agent is from a mobile device, otherwise false.
 */
export const isMobileUserAgent = (userAgent) => {
  const enableMobileDetection =
    process.env.FF_ENABLE_MOBILE_DETECTION === "true";
  if (!enableMobileDetection) {
    return true;
  }
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    userAgent
  );
};

/**
 * Converts a date string in "DD/MM/YYYY" format to ISO string.
 * @param {string} dateString - The date string to convert.
 * @returns {string|null} - The ISO string or null if the input is invalid.
 */
export const formatDatetoISO = (dateString) => {
  if (!dateString) {
    return null;
  }
  return moment(dateString, "DD/MM/YYYY").toISOString();
};

/**
 * Converts an ISO date string to "DD/MM/YYYY" format.
 * @param {string} isoDateString - The ISO date string to convert.
 * @returns {string|null} - The formatted date string or null if the input is invalid.
 */
export const formatDate = (isoDateString) => {
  if (!isoDateString) {
    return null;
  }
  return moment(isoDateString).format("DD/MM/YYYY");
};

/**
 * Validates a nickname.
 * @param {string} nickname - The nickname to validate.
 * @returns {boolean} - True if the nickname is valid, otherwise false.
 */
export function isValidNickname(nickname) {
  const regex = /^[a-zA-Z0-9_]{3,24}$/;
  return regex.test(nickname);
}

/**
 * Validates a date of birth.
 * @param {string} dob - The date of birth in "DD/MM/YYYY" format.
 * @returns {boolean} - True if the date of birth is valid, otherwise false.
 */
export function isValidDateOfBirth(dob) {
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = dob.match(regex);
  if (!match) {
    return !dob.includes("_");
  }

  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10) - 1;
  const year = parseInt(match[3], 10);
  const date = new Date(year, month, day);
  const currentDate = new Date();
  const minDate = new Date(
    currentDate.getFullYear() - 120,
    currentDate.getMonth(),
    currentDate.getDate()
  );

  return date > minDate && date < currentDate && date.getDate() === day;
}

/**
 * Removes the DDD (area code) from a phone number.
 * @param phoneNumber - The phone number with the DDD.
 * @returns {string} - The phone number without the DDD.
 */
export function removeDDD(phoneNumber) {
  // Use a regular expression to remove anything within parentheses
  return phoneNumber.replace(/\(\d{2}\)\s*/, "");
}

/**
 * Validates a phone number.
 * @param {string} phone - The phone number to validate.
 * @returns {boolean} - True if the phone number is valid, otherwise false.
 */
export function isValidPhoneNumber(phone) {
  // Remove any non-numeric characters
  let cleanedNumber = removeDDD(phone);

  cleanedNumber = cleanedNumber.replace(/\D/g, "");

  console.log(cleanedNumber);

  if (/^(\d)\1+$/.test(cleanedNumber)) {
    return false;
  }

  return /^\(\d{2}\) \d{5}-\d{4}$/.test(phone) || !phone.includes("_");
}

/**
 * Checks if the current environment is development.
 * @constant {boolean}
 */
export const inDevEnvironment =
  !!process && process.env.NODE_ENV === "development";

/**
 * Checks if the user's profile is completed.
 * @param {string} email - The user's email.
 * @param {Object} req - The request object.
 * @returns {Promise<boolean>} - True if the profile is completed, otherwise false.
 */
export async function checkProfileCompletion(email, req) {
  try {
    const data = await request("/users", "GET", null, { email }, true, req);
    return data.isProfileCompleted;
  } catch (error) {
    console.log(error);
    return false;
  }
}

/**
 * Gets notifications by email.
 * @param {string} email - The user's email.
 * @param {Object} req - The request object.
 * @returns {Promise<Array>} - The list of notifications.
 */
export async function getNotificationsByEmail(email, req) {
  try {
    const data = await request(
      "/notifications",
      "GET",
      null,
      { email },
      true,
      req
    );
    return data.data;
  } catch (error) {
    console.log(error);
    return [];
  }
}

/**
 * Updates notifications by their IDs.
 * @param {Array<string>} notificationIds - The IDs of the notifications to update.
 * @param {Object} req - The request object.
 * @returns {Promise<Object|null>} - The response data or null if an error occurred.
 */
export async function patchNotifications(notificationIds, req) {
  try {
    const data = await request(
      "/notifications",
      "PATCH",
      { notificationIds },
      undefined,
      true,
      req
    );
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

/**
 * Pauses execution for a specified number of milliseconds.
 * @param {number} ms - The number of milliseconds to pause.
 * @returns {Promise<void>} - A promise that resolves after the specified time.
 */
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generates a referral code from an email.
 * @param {string} email - The user's email.
 * @returns {string} - The generated referral code.
 */
export function generateReferralCode(email) {
  const hash = crypto.createHash("sha256").update(email).digest("hex");
  let shortHash = hash.substring(0, 8);
  let code = parseInt(shortHash, 16).toString(36).toUpperCase();
  return code.substring(0, 6);
}

/**
 * Retrieves a cookie value by name.
 * @param {string} name - The name of the cookie.
 * @returns {string} - The cookie value or an empty string if not found.
 */
export function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return "";
}

/**
 * Validates the format of a date string.
 * @param {string} dateString - The date string to validate.
 * @returns {boolean} - True if the date string is valid, otherwise false.
 */
export function isValidDateFormat(dateString) {
  return moment(dateString, "YYYY-MM-DD", true).isValid();
}

/**
 * Validates if startDate is before endDate.
 * @param {string} startDate - The start date string.
 * @param {string} endDate - The end date string.
 * @returns {boolean} - True if startDate is before endDate, otherwise false.
 */
export function isStartDateBeforeEndDate(startDate, endDate) {
  return moment(startDate).isBefore(moment(endDate));
}

/**
 * Validates if a date string is in ISO 8601 format.
 * @param {string} dateString - The date string to validate.
 * @returns {boolean} - True if the date string is in ISO 8601 format, otherwise false.
 */
export function isValidISO8601Date(dateString) {
  return moment(dateString, moment.ISO_8601, true).isValid();
}

/**
 * Converts a decimal number to Brazilian currency format (BRL).
 *
 * @param {number} value - The decimal number to convert.
 * @return {string} The formatted currency string.
 */
export function formatToBRL(value) {
  if (!value) {
    return null;
  }

  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
