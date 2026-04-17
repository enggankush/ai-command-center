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
import AuthCard from "../../components/custom/AuthCard";
import CustomTextField from "../../components/custom/CustomTextField";
import CustomButton from "../../components/custom/CustomButton";

function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await authService.register(email, password, fullName);
      console.log("Registration successful:", response.data);
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <CustomBox>
        <AuthCard title="Register">
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
        <form onSubmit={handleRegister}>
          <CustomTextField
            id="fullName"
            name="fullName"
            type="text"
            label="Full Name"
            value={fullName}
            required
            onChange={(e) => setFullName(e.target.value)}
          />
          <CustomTextField
            id="email"
            name="email"
            type="email"
            label="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <CustomTextField
            id="password"
            name="password"
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
          />
          <CustomTextField
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            margin="normal"
            required
          />
          <CustomButton type="submit" text="Register" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Register"}
          </CustomButton>
        </form>

        <Box sx={{ marginTop: "1rem", textAlign: "center" }}>
          <Typography variant="body2">
            Already have an account?{" "}
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

export default Register;
