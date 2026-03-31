import axios from "axios";

const baseURL = process.env.REACT_APP_API_BASE_URL;

console.log("URL: " + baseURL);

const client = axios.create({
  baseURL: baseURL
});

/**
 * Exchanges a refresh token for a new access token (and rotated refresh token).
 * Uses plain axios so this request is not wrapped by the client's 401 handler.
 */
export async function refreshAccessToken() {
  const refresh = localStorage.getItem('refreshToken');
  if (!refresh) {
    return false;
  }
  const { data } = await axios.post(`${baseURL}/auth/refresh`, { refreshToken: refresh });
  if (data?.currentUser) {
    localStorage.setItem('token', data.currentUser);
  }
  if (data?.refreshToken) {
    localStorage.setItem('refreshToken', data.refreshToken);
  }
  return !!data?.currentUser;
}

client.interceptors.request.use(function(config) {
  if(config && config.headers)
    //console.log('Interceptor', localStorage.getItem('token'));
    config.headers['Authorization'] = "Bearer " + localStorage.getItem('token');
    return config;
})

client.interceptors.response.use(function (response) {
  return response;
}, async function (error) {
  if (error && error.response && error.response.status === 401 ){
    const originalRequest = error.config;
    if (!originalRequest) {
      localStorage.clear();
      CheckAuth.setIsUnauthorized();
      return Promise.reject(error);
    }
    const url = String(originalRequest.url || "");
    const isAuthCall =
      url.includes("/auth/authenticate") ||
      url.includes("/auth/mfa/verify") ||
      url.includes("/auth/refresh");
    if (!isAuthCall && !originalRequest._retry) {
      originalRequest._retry = true;
      const refresh = localStorage.getItem('refreshToken');
      if (refresh) {
        try {
          await refreshAccessToken();
          originalRequest.headers['Authorization'] = "Bearer " + localStorage.getItem('token');
          return client(originalRequest);
        } catch (e) {
          // fall through to logout
        }
      }
    }
    localStorage.clear();
    CheckAuth.setIsUnauthorized();
  }
  
  return Promise.reject(error);
});
console.log("Axios URL: " + client.getUri());

export class CheckAuth {
  static isUnauthorized = false;
    
  static setIsUnauthorized() {
    this.isUnauthorized = true;
     }

  static resetToAuthorized() {
    this.isUnauthorized = false;
       }
 }

export default client;
