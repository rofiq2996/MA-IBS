import { User } from '../types';

export const API_URL = '/api';

export const apiClient = async (endpoint: string, options: RequestInit = {}) => {
  const url = endpoint === '/sync' ? `${API_URL}/sync.php` : `${API_URL}${endpoint}`;
  console.log('Fetching API:', url);
  const defaultHeaders = { 'Content-Type': 'application/json' };

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      const text = await response.text();
      console.warn("API returned non-JSON response for url:", url, "text:", text.substring(0, 100));
      throw new Error("Invalid JSON response from API");
    }
  } catch (error) {
    console.error("API fetch failed:", url, error);
    throw error;
  }
}

