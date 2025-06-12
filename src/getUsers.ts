export async function getUsers(token: string): Promise<any[]> {
  const response = await fetch("https://challenge.sunvoy.com/users", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  const users = await response.json();
  return users;
}
