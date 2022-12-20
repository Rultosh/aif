import axios from "axios";

console.log("URL: " + process.env.REACT_APP_API_BASE_URL);

const client = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL
});

client.defaults.headers.common['Authorization'] = 1;

console.log("Axios URL: " + client.getUri());

export default client;