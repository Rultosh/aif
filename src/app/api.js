import axios from "axios";

console.log("URL: " + process.env.REACT_APP_API_BASE_URL);

const client = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL
});

client.interceptors.request.use(function(config) {
  if(config && config.headers)
    console.log('Interceptor', localStorage.getItem('token'));
    config.headers['Authorization'] = "Bearer " + localStorage.getItem('token');
    return config;
})

console.log("Axios URL: " + client.getUri());

export default client;