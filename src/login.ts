import * as https from "https";
import * as querystring from "querystring";

// Constants
const BASE_URL = "https://challenge.sunvoy.com"; // Replace with the actual base URL
const CREDENTIALS = {
  email: "demo@example.org",
  password: "test",
};

// Fetch the login page to get the token (nonce)
async function getLoginPage(): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get(`${BASE_URL}/login`, (response) => {
      let data = "";

      // Collect data as chunks
      response.on("data", (chunk) => {
        data += chunk;
      });

      // On end of response, resolve with HTML content
      response.on("end", () => {
        resolve(data);
      });

      // Handle errors
      response.on("error", (error) => {
        reject(error);
      });
    });
  });
}

// Extract the nonce from the HTML content
function extractNonceFromHTML(html: string): string | null {
  const nonceMatch = html.match(/name="nonce" value="([^"]+)"/);
  if (nonceMatch && nonceMatch[1]) {
    return nonceMatch[1]; // Extract nonce value
  }
  return null; // Return null if nonce is not found
}

// Submit the login form with email, password, and nonce
async function submitLogin(nonce: string): Promise<string[]> {
  const formData = {
    username: CREDENTIALS.email,
    password: CREDENTIALS.password,
    nonce: nonce,
  };

  const postData = querystring.stringify(formData); // URL encode form data

  const options = {
    hostname: "challenge.sunvoy.com", // Replace with the actual domain
    path: "/login", // Login path
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded", // Form content type
      "Content-Length": Buffer.byteLength(postData), // Length of the post data
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseBody = "";
      const cookies: string[] = [];

      // Collect response data
      res.on("data", (chunk) => {
        responseBody += chunk;
      });

      // On end of response, resolve with response body
      res.on("end", () => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 400) {
          // Parse and resolve the response if successful
          const cookieHeader = res.headers["set-cookie"];
          if (cookieHeader) {
            // Cookies are returned as an array
            cookies.push(...cookieHeader);
          }
          console.log("Login Response:", responseBody); // Print the response body
          console.log("Extracted Cookies:", cookies); // Print the cookies
          resolve(cookies);
        } else {
          reject(`Login failed with status code: ${res.statusCode}`);
        }
      });
    });

    // Handle errors
    req.on("error", (error) => {
      reject(error);
    });

    // Send the form data
    req.write(postData);
    req.end();
  });
}

// Main function to log in
export async function login(): Promise<string[]> {
  try {
    // Step 1: Get the login page HTML
    const html = await getLoginPage();

    // Step 2: Extract the nonce from the page
    const nonce = extractNonceFromHTML(html);

    if (!nonce) {
      throw new Error("Nonce not found in the login page");
    }

    console.log("Extracted nonce:", nonce);

    // Step 3: Submit the login form with the extracted nonce
    const cookies = await submitLogin(nonce);

    console.log("Login successful:", cookies);
    return cookies;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}
