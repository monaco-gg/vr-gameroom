import axios from "axios";

const pendingRequests = {};

/**
 * Generates a unique key for a request based on the URL and request data.
 *
 * @param {string} url - The URL of the request.
 * @param {Object} data - The data being sent with the request.
 * @returns {string} The unique key for the request.
 */
const getRequestKey = (url, data) => {
  return url + JSON.stringify(data);
};

/**
 * Makes a POST request using Axios, ensuring no duplicate requests are made.
 *
 * @param {string} url - The URL of the request.
 * @param {Object} data - The data to be sent in the request.
 * @param {Object} [config={}] - Optional Axios configuration for the request.
 * @returns {Promise} A promise that resolves to the response of the request.
 */
const post = async (url, data, config = {}) => {
  const requestKey = getRequestKey(url, data);

  if (pendingRequests[requestKey]) {
    return pendingRequests[requestKey]; // Return the existing promise if request is already in progress
  }

  pendingRequests[requestKey] = axios
    .post(url, data, config)
    .then((response) => {
      delete pendingRequests[requestKey]; // Clean up the reference to the request
      return response;
    })
    .catch((error) => {
      delete pendingRequests[requestKey];
      throw error;
    });

  return pendingRequests[requestKey];
};

export { post };
