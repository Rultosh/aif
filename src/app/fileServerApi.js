import axios from "axios";
import { refreshAccessToken } from "./api";

console.log("File Server URL: " + process.env.REACT_APP_HTTP_FILE_SERVER_API_BASE_URL);

const fileServer = axios.create({
  baseURL: process.env.REACT_APP_HTTP_FILE_SERVER_API_BASE_URL
});

fileServer.interceptors.request.use(function(config) {
  if (config && config.headers)
    console.log('Interceptor', localStorage.getItem('token'));
    config.headers['Authorization'] = "Bearer " + localStorage.getItem('token');
    return config;
})

fileServer.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    if (error && error.response && error.response.status === 401) {
      const originalRequest = error.config;
      if (originalRequest && !originalRequest._retry) {
        originalRequest._retry = true;
        const refresh = localStorage.getItem('refreshToken');
        if (refresh) {
          try {
            await refreshAccessToken();
            originalRequest.headers['Authorization'] = "Bearer " + localStorage.getItem('token');
            return fileServer(originalRequest);
          } catch (e) {
            localStorage.clear();
          }
        }
      }
    }
    return Promise.reject(error);
  }
);

console.log("File server Axios URL: " + fileServer.getUri());

export default fileServer;
