
import { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import useAuthStore from './AuthStore';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});
const AuthContext = createContext();

export function AuthProvider({ children }) {

  let accessToken = useAuthStore.getState().accessToken;
  

  
  const router = useRouter();

  api.interceptors.request.use((config) => {
    accessToken = useAuthStore.getState().accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    console.log(accessToken);
    return config;
  });


  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (!error.response) {
        return Promise.reject(error);
      }

      if (false) {
        originalRequest._retry = true;

        try {
          const response = await api.get('/refresh');
          console.log(response)

          if (response.data != "logout") {
            const newToken = response.data;
            

            useAuthStore.getState().setAccessToken(newToken);

            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            console.log("Original ",newToken)
            return api(originalRequest);
          } else
            router.push('/');
        } catch (refreshError) {
          //logout();
          console.log(refreshError);
          router.push('/');
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );


  const login = async (ReqBody) => {
    try {
      const response = await api.post('/login', ReqBody);
      useAuthStore.getState().setAccessToken(response.data.token);
      router.push('/statistique');
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post('/logout');
      setAccessToken(null);
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ accessToken, login, logout, api }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);


