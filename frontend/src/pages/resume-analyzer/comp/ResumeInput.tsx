import React, { useState } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { uploadResume, ResumeResponse } from "../../../services/resumeService";

interface Props {
  onAnalysisComplete?: (data: ResumeResponse) => void;
}

const ResumeInput: React.FC<Props> = ({ onAnalysisComplete }) => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [jobDescription, setJobDescription] = useState(`
Required Qualifications:
* Currently pursuing or recently completed a degree in Computer Science, IT, or a related field
* Strong understanding of HTML, CSS, JavaScript, and backend fundamentals
* Familiarity with frontend frameworks (React, Angular, or Vue)
* Basic knowledge of backend technologies (Node.js, Python, etc.)
* Understanding of databases and API concepts
* Familiarity with Git or version control systems
* Problem-solving skills and ability to work independently
Preferred Skills:
* Experience with full-stack projects or coursework
* Familiarity with REST APIs and deployment processes
* Basic understanding of cloud platforms or hosting environments
* Exposure to real-world application architecture`);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ✅ File Validation
  const handleFileUpload = (file: File) => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Only PDF or DOCX files are allowed");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("File size must be less than 2MB");
      return;
    }

    setResumeFile(file);
    setFileName(file.name);
    setError("");
  };

  // ✅ SUBMIT HANDLER
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!resumeFile) {
      setError("Please upload a resume");
      return;
    }

    if (!jobDescription.trim()) {
      setError("Please enter job description");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await uploadResume(resumeFile, jobDescription);

      // optional callback
      if (onAnalysisComplete) {
        onAnalysisComplete(data);
      }

      // store result (for dashboard page)
      localStorage.setItem("resumeAnalysis", JSON.stringify(data));

      navigate("/ai-resume-analyzer/result");
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Typography variant="h4" sx={{ ml: 3 }}>
        Improve your resume with AI-powered insights
      </Typography>

      <Card sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit} sx={uploadStyle}>
            <Typography sx={{ fontWeight: "bold" }}>
              Upload Resume (PDF/DOCX, max 2MB)
            </Typography>

            {/* Upload Button */}
            <Button
              variant="outlined"
              component="label"
              disabled={loading}
              sx={{ textTransform: "none", fontSize: 16 }}
            >
              Choose File
              <input
                type="file"
                hidden
                accept=".pdf,.doc,.docx"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
              />
            </Button>

            {/* File Name */}
            {fileName && (
              <Typography variant="body2">
                Uploaded: <b>{fileName}</b>
              </Typography>
            )}

            {/* Job Description */}
            <TextField
              label="Job Description"
              multiline
              rows={5}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              fullWidth
              disabled={loading}
            />

            {/* Error */}
            {error && <Alert severity="error">{error}</Alert>}

            {/* Submit */}
            <Button
              type="submit"
              variant="contained"
              color="success"
              disabled={loading}
              sx={{ textTransform: "none", fontSize: 16 }}
            >
              {loading ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Analyzing...
                </>
              ) : (
                "Analyze Resume"
              )}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </>
  );
};

export default ResumeInput;

const uploadStyle = {
  border: "2px dashed #4caf50",
  borderRadius: 3,
  p: 4,
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  gap: 2,
};
