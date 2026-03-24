import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:5000/api', // Maps directly via pure IPv4 to bypass Windows DNS localhost resolution conflicts
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to automatically securely inject JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth
export const registerUser = (userData) => api.post('/auth/register', userData);
export const loginUser = (credentials) => api.post('/auth/login', credentials);
export const getProfile = () => api.get('/users/profile');

// Projects
export const fetchProjects = () => api.get('/projects');
export const createProject = (projectData) => api.post('/projects', projectData);
export const applyToProject = (projectId, userSkills) => api.post(`/projects/${projectId}/apply`, { userSkills });

// Tests & Reviews
export const submitTest = (testId, userAnswers) => api.post('/tests/submit', { testId, userAnswers });
export const submitReview = (reviewData) => api.post('/reviews/add', reviewData);

// Leaderboard
export const fetchLeaderboard = () => api.get('/leaderboard');

export default api;
