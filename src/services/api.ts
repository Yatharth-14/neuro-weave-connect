
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (name: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
};

// Threads API
export const threadsAPI = {
  getAllThreads: async () => {
    const response = await api.get('/threads');
    return response.data;
  },
  getThread: async (id: string) => {
    const response = await api.get(`/threads/${id}`);
    return response.data;
  },
  createThread: async (threadData: any) => {
    const response = await api.post('/threads', threadData);
    return response.data;
  },
  updateThread: async (id: string, threadData: any) => {
    const response = await api.put(`/threads/${id}`, threadData);
    return response.data;
  },
  deleteThread: async (id: string) => {
    const response = await api.delete(`/threads/${id}`);
    return response.data;
  },
  getTrendingThreads: async () => {
    const response = await api.get('/threads/trending');
    return response.data;
  },
  getUserThreads: async (userId: string) => {
    const response = await api.get(`/threads/user/${userId}`);
    return response.data;
  },
  generateSummary: async (threadId: string) => {
    const response = await api.post(`/threads/${threadId}/summary`);
    return response.data;
  },
};

// Search API
export const searchAPI = {
  semanticSearch: async (query: string) => {
    const response = await api.post('/search/semantic', { query });
    return response.data;
  },
  getKnowledgeGraph: async () => {
    const response = await api.get('/search/knowledge-graph');
    return response.data;
  },
};

export default api;
