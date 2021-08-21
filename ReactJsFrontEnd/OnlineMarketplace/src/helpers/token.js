import { isExpired, decodeToken } from "react-jwt";

export function getCurrentUser() {
  let json = localStorage.getItem("currentUser");
  return JSON.parse(json);
}

export function parseToken(currentUser) {
  return decodeToken(currentUser);
}
