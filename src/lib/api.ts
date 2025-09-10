/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { Storage } from './storage';

const BASE_URL = 'https://api.owoojumo.com/api/v1';

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding token
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await Storage.get('auth_token');
    if (token) {
      const headers = (config.headers ?? {}) as Record<string, string>;
      headers.Authorization = `Bearer ${token}`;
      config.headers = headers as any;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error?.response?.status === 401) {
      await Storage.remove('auth_token');
      // optionally trigger a redirect to login here
    }
    return Promise.reject(error);
  }
);


