import axios from 'axios';

import { fetchAndSetClerkToken } from '@/feature/auth/store/clerkToken.util';
import { getApiBaseUrl } from './getApiBaseUrl';

const api = axios.create({
  baseURL: getApiBaseUrl(),
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
