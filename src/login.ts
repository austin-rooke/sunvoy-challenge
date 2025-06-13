import * as https from "https";
import * as querystring from "querystring";
import { BASE_URL, CREDENTIALS, DOMAIN } from "./constants";

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

function extractNonceFromHTML(html: string): string | null {
  const nonceMatch = html.match(/name="nonce" value="([^"]+)"/);
  if (nonceMatch && nonceMatch[1]) {
    return nonceMatch[1];
  }
  return null;
}

async function submitLogin(nonce: string): Promise<string[]> {
  const formData = {
    username: CREDENTIALS.email,
    password: CREDENTIALS.password,
    nonce: nonce,
  };

  const postData = querystring.stringify(formData);

  const options = {
    hostname: DOMAIN,
    path: "/login",
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": Buffer.byteLength(postData),
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseBody = "";
      const cookies: string[] = [];

      res.on("data", (chunk) => {
        responseBody += chunk;
      });

      res.on("end", () => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 400) {
          const cookieHeader = res.headers["set-cookie"];
          if (cookieHeader) {
            cookies.push(...cookieHeader);
          }
          console.log("Login Response:", responseBody);
          console.log("Extracted Cookies:", cookies);
          resolve(cookies);
        } else {
          reject(`Login failed with status code: ${res.statusCode}`);
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

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
