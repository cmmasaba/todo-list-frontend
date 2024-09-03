import axios from 'axios';
import { auth } from './firebase';

const instance = axios.create({
  baseURL: 'http://0.0.0.0:8000',
});

// Request interceptor to add the token to headers
instance.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
