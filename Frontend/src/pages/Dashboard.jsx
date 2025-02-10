import { useState, useEffect } from "react";
import { Container, Typography, Button } from "@mui/material";
import axios from "axios";
import BookTable from "../components/BookTable";
import { useNavigate } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL;

function Dashboard() {
  const token = localStorage?.getItem("token");
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  const getAllBooks = () => {
    axios
      .get(`${apiUrl}api/book/books`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setBooks(res?.data?.data))
  };

  useEffect(() => {
    getAllBooks();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(`${apiUrl}api/auth/logout`, {}, { withCredentials: true });
      localStorage.removeItem("token"); // Remove token
      navigate("/"); // Redirect to login page
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <Container>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {" "}
        <Typography variant="h4">Book Management</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/addBook")}
        >
          Add Book
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleLogout} 
          >
          Logout
        </Button>
      </div>
      <div style={{ marginTop: "50px" }}></div>
      {books?.length > 0 ? (
        <BookTable books={books} getAllBooks={getAllBooks} />
      ) : (
        <p style={{ textAlign: "center", fontSize: "22px", fontWeight: "600" }}>
          No Books Found
        </p>
      )}
    </Container>
  );
}

export default Dashboard;
