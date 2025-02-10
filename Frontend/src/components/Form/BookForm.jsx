import React, { useEffect, useState } from "react";
import { TextField, Button, Container, Typography } from "@mui/material";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL;

const BookForm = ({ type }) => {
  const token = localStorage?.getItem("token");
  const [bookName, setBookName] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [isbn, setIsbn] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  console.log("id", id);

  const handleCreateBook = async () => {
    const payload = {
      title: bookName,
      author: authorName,
      isbn: isbn,
    };

    try {
      // Send registration data to the backend
      type !== "Edit"
        ? await axios.post(`${apiUrl}api/book/books`, payload, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        : await axios.put(`${apiUrl}api/book/books/${id}`, payload, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
      navigate("/dashboard"); // Redirect to homepage or login page
    } catch (error) {
      // If registration fails, alert the error
      const message =
        error?.response?.data?.message || "Book Createtion Failed";
      alert(message);
    }
  };

  useEffect(() => {
    if (type === "Edit" && id) {
      axios
        .get(`${apiUrl}api/book/books/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log("res", res);

          setBookName(res.data?.data?.title);
          setAuthorName(res.data?.data?.author); // corrected the case of "setauthorName" to "setAuthorName"
          setIsbn(res.data?.data?.isbn);
        })
        .catch((err) => {
          console.error("Error fetching book data", err);
        });
    }
  }, []);

  return (
    <Container maxWidth="sm">
      <Typography variant="h4">{type} Book</Typography>
      <TextField
        fullWidth
        label="Book Name"
        margin="normal"
        value={bookName}
        onChange={(e) => setBookName(e.target.value)}
      />
      <TextField
        fullWidth
        label="Author Name"
        margin="normal"
        value={authorName}
        onChange={(e) => setAuthorName(e.target.value)}
      />
      <TextField
        fullWidth
        label="ISBN"
        margin="normal"
        value={isbn}
        onChange={(e) => setIsbn(e.target.value)}
      />
      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={handleCreateBook}
      >
        {type == "Edit" ? "Edit" : "Create"}
      </Button>
    </Container>
  );
};

export default BookForm;
