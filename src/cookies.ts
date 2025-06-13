import * as fs from "fs/promises";

export async function readCookiesFromFile(): Promise<string[] | null> {
  try {
    const data = await fs.readFile("cookies.json", "utf-8");
    const parsedData = JSON.parse(data);
    return parsedData.cookies;
  } catch (error) {
    return null;
  }
}

export async function storeCookiesInFile(cookies: string[]): Promise<void> {
  const authDetails: { cookies: string[] } = { cookies };
  await fs.writeFile("cookies.json", JSON.stringify(authDetails, null, 2));
  console.log("Cookies saved successfully.");
}
