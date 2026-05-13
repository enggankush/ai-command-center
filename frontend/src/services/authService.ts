import API from "./api";

const authService = {
  login: (email: string, password: string) =>
    API.post(`auth/login`, { email, password }),

  register: (email: string, password: string, fullName: string) =>
    API.post(`auth/register`, { email, password, fullName }),

  forgotPassword: (email: string) =>
    API.post(`auth/forgot-password`, { email }),

  resetPassword: (token: string, newPassword: string) =>
    API.post(`auth/reset-password`, { token, newPassword }),
};

export default authService;

export const isLoggedIn = () => {
  return localStorage.getItem("token") !== null;
};
