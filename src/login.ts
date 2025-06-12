import { BASE_URL, CREDENTIALS } from "./constants";

export async function login(): Promise<string> {
  const loginResponse = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: process.env.EMAIL || CREDENTIALS.email,
      password: process.env.PASSWORD || CREDENTIALS.password,
    }),
  });

  if (!loginResponse.ok) {
    throw new Error("Failed to login");
  }

  const loginData: { token: string } = await loginResponse.json();
  return loginData.token;
}
