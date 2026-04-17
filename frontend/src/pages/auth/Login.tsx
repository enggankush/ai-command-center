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

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await authService.login(email, password);
      console.log("Login successful:", response.data);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("currentUser", JSON.stringify(response.data.user));
      navigate("/stats");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <CustomBox>
        <AuthCard title="Login">
          {error && (
            <Alert severity="error" sx={{ marginBottom: "1rem" }}>
              {error}
            </Alert>
          )}
        </AuthCard>
        <form onSubmit={handleLogin}>
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
          <CustomButton type="submit" text="Login" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Login"}
          </CustomButton>
        </form>

        <Box sx={{ marginTop: "1rem", textAlign: "center" }}>
          <Typography variant="body2">
            Don't have an account?{" "}
            <Link
              href="/register"
              underline="hover"
              sx={{ cursor: "pointer", fontWeight: "bold" }}
            >
              Register
            </Link>
          </Typography>
          <Typography variant="body2" sx={{ marginTop: "0.5rem" }}>
            <Link
              href="/forgot-password"
              underline="hover"
              sx={{ cursor: "pointer", fontWeight: "bold" }}
            >
              Forgot Password?
            </Link>
          </Typography>
        </Box>
      </CustomBox>
    </Container>
  );
}

export default Login;
