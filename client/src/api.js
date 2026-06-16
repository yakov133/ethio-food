import axios from "axios";

// Vite exposes client-safe values on import.meta.env, including legacy REACT_APP_* names via vite.config.js.
const env = import.meta.env;

export const API_URL = env.VITE_API_URL || env.REACT_APP_API_URL || "https://ethio-food-api.onrender.com";
export const FIREBASE_API_KEY = env.VITE_FIREBASE_API_KEY || env.REACT_APP_FIREBASE_API_KEY || "AIzaSyDBeYMdSNAk0KglYfPOg6DygYyinxRfugo";

const ADMIN_EMAILS = ["yakov133@walla.com", "ofekavi1104@gmail.com"];

// Local storage can contain stale data, so invalid JSON is cleared immediately.
export function getStoredAuth() {
  try {
    return JSON.parse(localStorage.getItem("auth"));
  } catch (err) {
    localStorage.removeItem("auth");
    return null;
  }
}

export function isAdminUser(user) {
  return Boolean(user && ADMIN_EMAILS.includes((user.email || "").toLowerCase()));
}

// Images are served by URL instead of fetching blobs into base64 strings.
export function getImageUrl(src) {
  if (!src) {
    return "";
  }

  const imageSrc = String(src);
  if (imageSrc.startsWith("data:") || imageSrc.startsWith("http://") || imageSrc.startsWith("https://")) {
    return imageSrc;
  }

  return `${API_URL}/image/${encodeURIComponent(imageSrc)}`;
}

const api = axios.create({
  baseURL: API_URL,
});

// Every API mutation/read that needs auth gets the Firebase token automatically.
api.interceptors.request.use((config) => {
  const auth = getStoredAuth();
  if (auth && auth.idToken) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${auth.idToken}`;
  }

  return config;
});

export default api;
