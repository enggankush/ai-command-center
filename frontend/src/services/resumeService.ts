import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/resume",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export type ResumeResponse = any;

// MAIN API FUNCTION
export const uploadResume = async (
  file: File,
  jobDescription: string,
): Promise<ResumeResponse> => {
  const formData = new FormData();
  formData.append("resume", file);
  formData.append("jobDescription", jobDescription);

  const res = await API.post("/analyze", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data.data;
};

export const recompareResume = async (id: string) => {
  const res = await API.post(`/recompare/${id}`);
  return res.data.data;
};
