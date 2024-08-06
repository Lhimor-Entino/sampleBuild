import { CookieAttributes } from "node_modules/@types/js-cookie";

export const coookie_options : CookieAttributes  = {
    expires: 7,
    secure: false,
    sameSite: "lax",
    domain: window.location.hostname,
  };
  export const API_BASE_URL = "http://192.168.23.84:8007/ddcic/api/beta";