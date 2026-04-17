import axios from "axios";

const API_BASE_URL = "/api/auth";

const authService = {
  login: (email: string, password: string) =>
    axios.post(`${API_BASE_URL}/login`, { email, password }),

  register: (email: string, password: string, fullName: string) =>
    axios.post(`${API_BASE_URL}/register`, { email, password, fullName }),

  forgotPassword: (email: string) =>
    axios.post(`${API_BASE_URL}/forgot-password`, { email }),

  resetPassword: (token: string, newPassword: string) =>
    axios.post(`${API_BASE_URL}/reset-password`, { token, newPassword }),
};

export default authService;
