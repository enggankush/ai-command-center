import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  Link,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import CustomBox from "../../components/custom/CustomBox";
import AuthCard from "./comp/AuthCard";
import CustomTextField from "../../components/custom/CustomTextField";
import CustomButton from "../../components/custom/CustomButton";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    setLoading(true);
    try {
      const response = await authService.forgotPassword(email);
      console.log("Forgot password request:", response.data);
      setSuccess("Check your email for password reset instructions.");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to process forgot password request",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <CustomBox>
        <AuthCard title="Forgot Password">
          <Typography
            variant="body2"
            sx={{ marginBottom: "1.5rem", textAlign: "center", color: "#666" }}
          >
            Enter your email address and we'll send you a link to reset your
            password.
          </Typography>
          {error && (
            <Alert severity="error" sx={{ marginBottom: "1rem" }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ marginBottom: "1rem" }}>
              {success}
            </Alert>
          )}
        </AuthCard>

        <form onSubmit={handleForgotPassword}>
          <CustomTextField
            id="email"
            name="email"
            type="email"
            label="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <CustomButton type="submit" text="Send Reset Link" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Send Reset Link"}
          </CustomButton>
        </form>

        <Box sx={{ marginTop: "1rem", textAlign: "center" }}>
          <Typography variant="body2">
            Remember your password?{" "}
            <Link
              href="/login"
              underline="hover"
              sx={{ cursor: "pointer", fontWeight: "bold" }}
            >
              Login
            </Link>
          </Typography>
        </Box>
      </CustomBox>
    </Container>
  );
}

export default ForgotPassword;
