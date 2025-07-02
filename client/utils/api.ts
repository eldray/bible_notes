// api.ts
import axios from "axios";
import Constants from "expo-constants";
import { supabase } from "../config/supabase";

const api = axios.create({
  baseURL: Constants.expoConfig?.extra?.apiUrl || "http://localhost:3000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
console.log("API baseURL:", Constants.expoConfig?.extra?.apiUrl || "http://localhost:3000");

// Add JWT token to requests
api.interceptors.request.use(
  async (config) => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      console.log("Supabase session:", { session: session ? { access_token: session.access_token, expires_at: session.expires_at } : null, error });
      if (error) {
        console.error("Failed to get Supabase session:", error.message);
      }
      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
        console.log("Authorization header set:", config.headers.Authorization);
      } else {
        console.warn("No session token available");
      }
    } catch (error: any) {
      console.error("Error in request interceptor:", error.message);
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error.message);
    return Promise.reject(error);
  },
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.log("Unauthorized (401): Attempting to refresh session");
      const { data, error: refreshError } = await supabase.auth.refreshSession();
      if (data.session) {
        console.log("Session refreshed, retrying request");
        error.config.headers.Authorization = `Bearer ${data.session.access_token}`;
        return api(error.config);
      } else {
        console.error("Failed to refresh session:", refreshError?.message);
      }
    } else if (!error.response) {
      console.error("Network error: No response received", error.message);
      if (error.message.includes("Network Error")) {
        console.error("Possible CORS issue or server unreachable");
      }
    } else {
      console.error("API error:", {
        status: error.response?.status,
        data: error.response?.data,
      });
    }
    return Promise.reject(error);
  },
);

export default api;