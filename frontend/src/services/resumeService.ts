import API from "./api";

export type ResumeResponse = any;

// MAIN API FUNCTION
export const uploadResume = async (
  file: File,
  jobDescription: string,
): Promise<ResumeResponse> => {
  const formData = new FormData();
  formData.append("resume", file);
  formData.append("jobDescription", jobDescription);

  const res = await API.post("/resume/analyze", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data.data;
};

export const recompareResume = async (id: string) => {
  const res = await API.post(`/resume/recompare/${id}`);
  return res.data.data;
};
