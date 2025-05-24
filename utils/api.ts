import axios from 'axios';

import { fetchAndSetClerkToken } from '@/feature/auth/store/clerkToken.util';

const baseUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
const prefix = process.env.EXPO_PUBLIC_BACKEND_API_PREFIX;

const api = axios.create({
  baseURL: `${baseUrl}/${prefix}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const token = await fetchAndSetClerkToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  return config;
});

export default api;
