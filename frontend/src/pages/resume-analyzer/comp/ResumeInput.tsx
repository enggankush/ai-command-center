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
import { uploadResume, ResumeResponse } from "../../../services/resumeService";

interface Props {
  onAnalysisComplete?: (data: ResumeResponse) => void;
}

const ResumeInput: React.FC<Props> = ({ onAnalysisComplete }) => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // File Validation
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

  // SUBMIT HANDLER
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

      if (onAnalysisComplete) {
        onAnalysisComplete(data);
      } else {
        console.warn("onAnalysisComplete not provided");
      }

      // optional reset form
      setResumeFile(null);
      setFileName("");
      setJobDescription("");
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

            {fileName && (
              <Typography variant="body2">
                Uploaded: <b>{fileName}</b>
              </Typography>
            )}

            <TextField
              label="Job Description"
              multiline
              rows={5}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              fullWidth
              disabled={loading}
            />

            {error && <Alert severity="error">{error}</Alert>}

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
