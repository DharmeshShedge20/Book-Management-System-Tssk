import { useState } from "react";
import { TextField, Button, Container, Typography } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL;

function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      // Send registration data to the backend
      await axios.post(`${apiUrl}api/auth/register`, {
        fullName,
        email,
        password,
      });
      navigate("/"); // Redirect to homepage or login page
    } catch (error) {
      // If registration fails, alert the error
      const message = error?.response?.data?.message || "Registration Failed";
      alert(message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4">Register</Typography>
      <TextField
        fullWidth
        label="Full Name"
        margin="normal"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />
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
      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={handleRegister}
      >
        Register
      </Button>
    </Container>
  );
}

export default Register;
