import { User } from "./user";

export async function getUsers(cookies: string[]): Promise<User[]> {
  const response = await fetch("https://challenge.sunvoy.com/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookies.join("; "),
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  const users = (await response.json()) as User[];

  return users;
}
