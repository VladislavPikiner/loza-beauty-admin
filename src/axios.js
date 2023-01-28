import axios from "axios";

const instance = axios.create({
  baseURL: "https://champagne-harp-seal-fez.cyclic.app",
});

export default instance;
