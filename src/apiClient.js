import axios from 'axios';

const apiClient = axios.create({ baseURL: 'http://127.0.0.1:8000/api/v1' });
// const apiClient = axios.create({ baseURL: 'http://192.168.43.139:8000/api/v1' });
// http://192.168.43.139:3000

export default apiClient;