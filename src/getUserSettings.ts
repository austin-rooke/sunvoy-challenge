import * as https from "https";
import { User } from "./user";
import { extractInputsFromHTML } from "./extractDataFromHtml";
import { createCheckCode } from "./createCheckCode";
import { DOMAIN } from "./constants";

async function getSettingsPage(cookies: string[]): Promise<string> {
  const cookieHeader = cookies.join("; ");
  const options = {
    hostname: DOMAIN,
    path: "/settings/tokens",
    method: "GET",
    timeout: 20000,
    headers: {
      Cookie: cookieHeader,
      "User-Agent": "Mozilla/5.0",
    },
  };

  return new Promise((resolve, reject) => {
    https.get(options, (response) => {
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

export async function getUserSettings(cookies: string[]): Promise<User> {
  const html = await getSettingsPage(cookies);
  const extractedData = extractInputsFromHTML(html);

  const checkCode = createCheckCode(extractedData);

  extractedData.timestamp = String(checkCode.timestamp);
  extractedData.checkcode = checkCode.checkcode;
  const response = await fetch("https://api.challenge.sunvoy.com/api/settings", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Cookie: cookies.join("; "),
    },
    body: new URLSearchParams(extractedData).toString(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  const myUser = (await response.json()) as User;
  console.log(`Found user ${myUser.firstName} ${myUser.lastName}`);
  return myUser;
}
