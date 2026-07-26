import axios from "axios";

const NEXON_API_KEY = import.meta.env.VITE_NEXON_API_KEY;

export const nexonClient = axios.create({
  baseURL: "https://open.api.nexon.com/fconline/v1",
  headers: {
    "x-nxopen-api-key": NEXON_API_KEY,
  },
});
