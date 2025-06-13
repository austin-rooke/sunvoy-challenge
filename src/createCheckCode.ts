import * as crypto from "crypto";

interface RequestData {
  [key: string]: string | number;
}

interface SignedRequestResult {
  payload: string;
  checkcode: string;
  fullPayload: string;
  timestamp: number;
}

export function createCheckCode(data: RequestData): SignedRequestResult {
  const timestamp = Math.floor(Date.now() / 1000);

  const dataWithTimestamp: any = {
    ...data,
    timestamp: timestamp.toString(),
  };

  const queryString = Object.keys(dataWithTimestamp)
    .sort()
    .map((key) => `${key}=${encodeURIComponent(dataWithTimestamp[key])}`)
    .join("&");

  const hmac = crypto.createHmac("sha1", "mys3cr3t");
  hmac.update(queryString);

  const checkcode = hmac.digest("hex").toUpperCase();

  return {
    payload: queryString,
    checkcode,
    fullPayload: `${queryString}&checkcode=${checkcode}`,
    timestamp,
  };
}
