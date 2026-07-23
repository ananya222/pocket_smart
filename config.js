// config.js
// Centralized configuration for the app.
// Change this URL to your public ngrok URL (e.g., "https://frolic-capably-wasp.ngrok-free.app") when sharing with external testers.
export const API_BASE_URL = "https://frolic-capably-wasp.ngrok-free.dev";

import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "user_jwt_token";

export async function saveToken(token) {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } catch (error) {
    console.error("Error saving token", error);
  }
}

export async function getToken() {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch (error) {
    console.error("Error getting token", error);
    return null;
  }
}

export async function removeToken() {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch (error) {
    console.error("Error removing token", error);
  }
}

export async function apiFetch(endpoint, options = {}) {
  const token = await getToken();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`;
  return fetch(url, {
    ...options,
    headers,
  });
}
