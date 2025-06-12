import * as https from "https";
import { User } from "./user";
import { BASE_URL } from "./constants";

async function getSettingsPage(cookies: string[]) {
  return new Promise((resolve, reject) => {
    https.get(`${BASE_URL}/settings/tokens`, (response) => {
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
