import { User } from '../types';

const getApiUrl = () => {
  let url = (import.meta as any).env?.VITE_API_URL || '/api';
  if (url && url !== '/api') {
    url = url.trim().replace(/\/$/, '');
    if (!url.endsWith('/api')) {
      url = `${url}/api`;
    }
  }
  return url;
};

export const API_URL = getApiUrl();

export const apiClient = async (endpoint: string, options: RequestInit = {}) => {
  const url = endpoint === '/sync' ? `/api/sync.php` : `${API_URL}${endpoint}`;
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
    console.error("API fetch failed:", (error as Error).message);
    throw error;
  }
};

