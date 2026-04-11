import Cookies from "js-cookie";

const ACCESS_TOKEN_KEY = "accessToken";

export function getAccessToken(): string | undefined {
  return Cookies.get(ACCESS_TOKEN_KEY);
}
