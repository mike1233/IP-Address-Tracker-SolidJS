import axios from "axios";
const BASE_URL = "https://geo.ipify.org/api/v2";

export const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 1000,
  params: {
    apiKey: import.meta.env.VITE_GEOLOCATION_API_KEY,
  },
});
