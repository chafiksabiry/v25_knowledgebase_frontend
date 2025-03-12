import axios from 'axios';

// Create an axios instance with the base URL
const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api',
});

export default apiClient; 