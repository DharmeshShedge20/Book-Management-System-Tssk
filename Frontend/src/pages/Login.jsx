import { useState } from "react";
import { TextField, Button, Container, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  console.log("API URL:", apiUrl); // Debugging API URL

  const handleLogin = async () => {
    try {
      // Clear any existing tokens before login to prevent stale session issues
      localStorage.removeItem("token");

      const { data } = await axios.post(
        `${apiUrl}api/auth/login`,
        { email, password },
        { withCredentials: true } // Ensure cookies are sent with the request
      );

      console.log("Login Response:", data);

      // Store the token in local storage
      localStorage.setItem("token", data.data?.accessToken);

      // Redirect user to the dashboard
      navigate("/dashboard");
      window.location.reload(); // Force re-render to prevent blank screen issue
    } catch (error) {
      console.error("Login Error:", error);
      alert("Invalid Credentials");
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4">Login</Typography>
      <TextField
        fullWidth
        label="Email"
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        fullWidth
        type="password"
        label="Password"
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button fullWidth variant="contained" color="primary" onClick={handleLogin}>
        Login
      </Button>
      <Typography variant="body2" style={{ marginTop: 10 }}>
        New user? <Link to="/register">Register here</Link>
      </Typography>
    </Container>
  );
}

export default Login;
