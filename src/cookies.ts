import * as fs from "fs/promises";
import { getUsers } from "./getUsers";

export async function readCookiesFromFile(): Promise<string[] | null> {
  try {
    const data = await fs.readFile("cookies.json", "utf-8");
    const parsedData = JSON.parse(data);
    console.log("Reading cookies from cache...");
    return parsedData.cookies;
  } catch (error) {
    return null;
  }
}

export async function storeCookiesInFile(cookies: string[]): Promise<void> {
  const authDetails: { cookies: string[] } = { cookies };
  await fs.writeFile("cookies.json", JSON.stringify(authDetails, null, 2));
  console.log("Saving cookies to cache...");
}

export async function validateCookies(cookies: string[] | null): Promise<boolean> {
  try {
    console.log("Validating cookies...");
    if (!cookies) {
      return false;
    }
    const response = await getUsers(cookies);
    return response.length > 0;
  } catch (error) {
    return false;
  }
}
