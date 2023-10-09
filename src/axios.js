import axios from "axios";

const instance = axios.create({
  // baseURL: "https://loza-beauty-backend.vercel.app",
  baseURL: "http://localhost:8080",
});

export default instance;
