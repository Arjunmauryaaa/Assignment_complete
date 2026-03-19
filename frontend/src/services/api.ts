import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const projectService = {
  getAll: (page = 1, limit = 10) => api.get(`/projects?page=${page}&limit=${limit}`),
  getById: (id: string) => api.get(`/projects/${id}`),
  create: (data: { name: string; description?: string }) => api.post('/projects', data),
  delete: (id: string) => api.delete(`/projects/${id}`),
};

export const taskService = {
  getByProject: (projectId: string, status?: string, sortBy = 'due_date', order = 'ASC') => {
    let url = `/projects/${projectId}/tasks?sort_by=${sortBy}&order=${order}`;
    if (status) url += `&status=${status}`;
    return api.get(url);
  },
  create: (projectId: string, data: any) => api.post(`/projects/${projectId}/tasks`, data),
  update: (taskId: string, data: any) => api.put(`/tasks/${taskId}`, data),
  delete: (taskId: string) => api.delete(`/tasks/${taskId}`),
};

export default api;
