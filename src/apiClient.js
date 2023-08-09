import axios from 'axios';
import 'dotenv/config';

const apiClient = axios.create({ baseURL: process.env.BASE_URL });

export default apiClient;