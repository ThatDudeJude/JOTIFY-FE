import axios from 'axios';
import 'dotenv/config';

const apiClient = axios.create({ baseURL: ProcessingInstruction.env.BASE_URL });

export default apiClient;