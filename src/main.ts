import * as fs from "fs/promises";
import { login } from "./login";
import { getUsers } from "./getUsers";
import { getUserSettings } from "./getUserSettings";
import { readCookiesFromFile, storeCookiesInFile, validateCookies } from "./cookies";

async function bootstrap() {
  try {
    // Step 1: check saved authentication details
    let cookies = await readCookiesFromFile();
    // Step 1-2:  check if cookies are valid
    const isCookiesValid = await validateCookies(cookies);
    if (cookies && !isCookiesValid) {
      console.log("Cookies are invalid. Re-logging in...");
      cookies = null;
    }
    if (!cookies) {
      console.log("Cookies not found or invalid. Logging in...");
      // Step 1-3: Login if no credentials were found
      cookies = await login();
      // Step 1-4: Save the cookies
      await storeCookiesInFile(cookies);
    }
    // Step 2: Get the users
    const users = await getUsers(cookies);
    console.log(`Found ${users.length} users`);

    // Step 3: Get logged in user's settings
    const myUser = await getUserSettings(cookies);
    const totalUsers = [...users, myUser];

    // Step 4: Save the users
    await fs.writeFile("users.json", JSON.stringify(totalUsers, null, 2));

    console.log("Saved users in users.json");
  } catch (error) {
    console.error("Error:", error);
  }
}

bootstrap();
