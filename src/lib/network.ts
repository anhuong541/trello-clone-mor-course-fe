import axios from "axios";

export const server = axios.create({
  // baseURL: process.env.NEXT_PUBLIC_SERVER_DOMAIN ?? "http://localhost:3456/",
  baseURL: "http://localhost:3456/",
  withCredentials: true,
});
