import * as fs from "fs/promises";
import { login } from "./login";
import { getUsers } from "./getUsers";
import { getUserSettings } from "./getUserSettings";
import { readCookiesFromFile, storeCookiesInFile } from "./cookies";

async function bootstrap() {
  try {
    // Step 1: check saved authentication details
    let cookies = await readCookiesFromFile();
    if (!cookies) {
      console.log("Cookies not found or invalid. Logging in...");
      // Step 1-2: Login if no credentials were found
      cookies = await login();
      // Step 1-3: Save the cookies
      await storeCookiesInFile(cookies);
    }
    // Step 2: Get the users
    const users = await getUsers(cookies);

    // Step 3: Get logged in user's settings
    const myUser = await getUserSettings(cookies);
    const totalUsers = [...users, myUser];

    // Step 4: Save the users
    await fs.writeFile("users.json", JSON.stringify(totalUsers, null, 2));

    console.log("Finished Processing!");
  } catch (error) {
    console.error("Error:", error);
  }
}

bootstrap();
