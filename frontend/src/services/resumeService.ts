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

export interface ResumeResponse {
  score: number;
  keywords: {
    matched: string[];
    missing: string[];
  };
  sections: {
    skills: boolean;
    education: boolean;
    experience: boolean;
  };
  suggestions: string[];
  feedback: string[];
}

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
