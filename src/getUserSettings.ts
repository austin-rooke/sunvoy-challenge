import * as https from "https";
import { User } from "./user";
import { BASE_URL } from "./constants";

async function getSettingsPage(cookies: string[]) {
  const cookieHeader = cookies.join("; ");

  const options = {
    hostname: "challenge.sunvoy.com", // The domain
    path: "/settings/tokens", // The path to the settings page
    method: "GET",
    timeout: 20000,
    headers: {
      Cookie: cookieHeader, // Add cookies to the request
      "User-Agent": "Mozilla/5.0", // Optional: mimic a browser request
    },
  };

  return new Promise((resolve, reject) => {
    https.request(options, (response) => {
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
  console.log({ html });
  return {} as User;
  const response = await fetch("https://api.challenge.sunvoy.com/api/settings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookies.join("; "),
    },
  });
  console.log({ response });
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  const myUser = (await response.json()) as User;
  return myUser;
}
