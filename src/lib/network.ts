import axios from "axios";

export const server = axios.create({
  // baseURL:
  //   process.env.NODE_ENV === "production"
  //     ? process.env.NEXT_PUBLIC_SERVER_DOMAIN
  //     : "http://localhost:3456/",
  // baseURL: process.env.NEXT_PUBLIC_SERVER_DOMAIN && "http://localhost:3456/",
  // baseURL: "https://trello-clone-mor-backend.onrender.com/",
  baseURL: "http://localhost:3456/",
  withCredentials: true,
});
