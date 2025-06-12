import * as fs from "fs/promises";
import { login } from "./login";
import { getUsers } from "./getUsers";

async function main() {
  try {
    const token = await login();
    const users = await getUsers(token);

    // Save the first 10 users into a file
    const first10Users = users.slice(0, 10);
    await fs.writeFile("users.json", JSON.stringify(first10Users, null, 2));

    console.log("users.json created successfully");
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
