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
  Paper,
} from "@mui/material";
import { Document, Page } from "react-pdf";

interface Props {
  onAnalysisComplete: (data: any) => void;
}

const ResumeInput: React.FC<Props> = ({ onAnalysisComplete }) => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  // ✅ File Upload Validation
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

  // ✅ Submit Handler
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

      const formData = new FormData();
      formData.append("resume", resumeFile);
      formData.append("jobDescription", jobDescription);

      // 🔥 Replace with your backend API
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      onAnalysisComplete(data);
    } catch (err) {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Typography variant="h4">
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
              <Typography variant="body2">Uploaded: {fileName}</Typography>
            )}

            {/* PDF Preview only */}
            {resumeFile && resumeFile.type === "application/pdf" && (
              <Paper sx={{ p: 2, overflow: "auto" }}>
                <Document
                  file={resumeFile}
                  onLoadSuccess={onDocumentLoadSuccess}
                >
                  <Page pageNumber={pageNumber} />
                </Document>

                {numPages > 1 && (
                  <Box
                    sx={{
                      mt: 2,
                      display: "flex",
                      justifyContent: "center",
                      gap: 1,
                    }}
                  >
                    <Button
                      size="small"
                      onClick={() =>
                        setPageNumber((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={pageNumber === 1}
                    >
                      Prev
                    </Button>

                    <Typography>
                      {pageNumber} / {numPages}
                    </Typography>

                    <Button
                      size="small"
                      onClick={() =>
                        setPageNumber((prev) => Math.min(prev + 1, numPages))
                      }
                      disabled={pageNumber === numPages}
                    >
                      Next
                    </Button>
                  </Box>
                )}
              </Paper>
            )}

            {/* Job Description */}
            <TextField
              label="Job Description"
              multiline
              rows={5}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              fullWidth
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
              {loading ? <CircularProgress size={20} /> : "Analyze Resume"}
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
