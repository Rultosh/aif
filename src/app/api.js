import axios from "axios";

console.log("URL: " + process.env.REACT_APP_API_BASE_URL);

const client = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL
});

client.interceptors.request.use(function(config) {
  if(config && config.headers)
    //console.log('Interceptor', localStorage.getItem('token'));
    config.headers['Authorization'] = "Bearer " + localStorage.getItem('token');
    return config;
})

client.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  if (error.response.status === 401 || error.response.status === 403){
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