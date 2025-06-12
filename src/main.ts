import * as fs from "fs/promises";
import { login } from "./login";
import { getUsers } from "./getUsers";
import { getUserSettings } from "./getUserSettings";

async function main() {
  try {
    const cookies = await login();
    const users = await getUsers(cookies);

    const myUser = await getUserSettings(cookies);
    const totalUsers = [...users, myUser];
    await fs.writeFile("users.json", JSON.stringify(totalUsers, null, 2));

    console.log("users.json created successfully");
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
