export const API_URL = 
  process.env.NEXT_PUBLIC_API_URL || 
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:8000"
    : "https://school-pro-api-6mxq-5qzq.onrender.com");

export const APP_URL = 
  process.env.NEXT_PUBLIC_APP_URL || 
  (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");

export function getApiUrl(): string {
  return API_URL;
}
