import axios from "axios";

console.log("File Server URL: " + process.env.REACT_APP_HTTP_FILE_SERVER_API_BASE_URL);

const fileServer = axios.create({
  baseURL: process.env.REACT_APP_HTTP_FILE_SERVER_API_BASE_URL
});

fileServer.interceptors.request.use(function(config) {
  if(config && config.headers)
    console.log('Interceptor', localStorage.getItem('token'));
    config.headers['Authorization'] = "Bearer " + localStorage.getItem('token');
    return config;
})

console.log("File server Axios URL: " + fileServer.getUri());

export default fileServer;