/**
 * Makes an HTTP request to the specified URL with the given method, data, headers, and cookies.
 *
 * @param {string} url - The endpoint URL to send the request to.
 * @param {string} [method="GET"] - The HTTP method to use for the request (GET, POST, PUT, DELETE, etc.).
 * @param {Object} [data=null] - The data to be sent in the body of the request (for POST, PUT, etc.).
 * @param {Object} [queryParams={}] - The query parameters to include in the request URL.
 * @param {Array<{name: string, value: string}>} [cookies=[]] - An array of cookies to include in the request.
 * @param {boolean} [includeCookies=true] - Whether to include cookies in the request.
 * @param {Object} [headers={}] - Additional headers to include in the request.
 * @returns {Promise<Object>} - The JSON response from the server.
 * @throws {Error} - Throws an error if the response is not ok.
 */
async function requestCustom(
  url,
  method = "GET",
  data = null,
  queryParams = {},
  cookies = [],
  includeCookies = true,
  headers = {}
) {
  // Generate the Cookie header from the cookies array
  const cookieHeader = cookies
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join(";");

  // Merge default headers with additional headers
  const defaultHeaders = {
    "Content-Type": "application/json",
    Cookie: cookieHeader,
    ...headers,
  };

  // Convert query parameters to a query string
  let queryString = new URLSearchParams(queryParams).toString();
  if (queryString) {
    queryString = `?${queryString}`;
  }

  // Configure the request
  const config = {
    method,
    headers: defaultHeaders,
    credentials: includeCookies ? "include" : "same-origin", // Client-side configuration for including credentials
  };

  // Add the request body if data is provided
  if (data) {
    config.body = JSON.stringify(data);
  }

  // Perform the fetch request
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api${url}${queryString}`,
    config
  );

  // Check if the response is ok, otherwise throw an error
  if (!response.ok) {
    const errorData = await response.json();
    const error = new Error("API request error");
    error.data = errorData;
    throw error;
  }

  // Return the JSON response
  return response.json();
}

export default requestCustom;
