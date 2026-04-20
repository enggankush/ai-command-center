import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import Stats from "./pages/Stats";
import Layout from "./Layout";
import TodoPage from "./pages/ai-todo/TodoPage";

// ✅ Layout wrapper using Outlet
const LayoutWrapper = () => (
  <Layout>
    <Outlet />
  </Layout>
);

function App() {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#1976d2",
      },
      secondary: {
        main: "#dc004e",
      },
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* ✅ Main Layout (Header only once) */}
          <Route element={<LayoutWrapper />}>
            <Route path="/stats" element={<Stats />} />
            <Route path="/to-do" element={<TodoPage />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
