import {Table,TableHead,TableRow,TableCell,TableBody,Button} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

function BookTable({ books, getAllBooks }) {
  const navigate = useNavigate();
  const token = localStorage?.getItem("token");

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}api/book/books/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      getAllBooks();
    } catch (error) {
      console.error("Error deleting book:", error);
      alert("Error deleting book. Please try again.");
    }
  };
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Title</TableCell>
          <TableCell>Author</TableCell>
          <TableCell>ISBN No</TableCell>
          <TableCell>Publish Date</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {books.map((book) => (
          <TableRow key={book.id}>
            <TableCell>{book.title}</TableCell>
            <TableCell>{book.author}</TableCell>
            <TableCell>{book.isbn}</TableCell>
            <TableCell>{book.publishedDate.split("T")[0]}</TableCell>
            <TableCell>
              <Button
                color="primary"
                onClick={() => navigate(`/editBook/${book?._id}`)}
              >
                Edit
              </Button>
              <Button color="secondary" onClick={() => handleDelete(book._id)}>
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default BookTable;
