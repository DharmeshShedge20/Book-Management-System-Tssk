import { Router } from "express";
import { getAllBooks, getBookById, createBook, updateBook, deleteBook} from "../controllers/bookController.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/books").get(verifyJWT, getAllBooks).post(verifyJWT, createBook);
router.route("/books/:id").get(verifyJWT, getBookById).put(verifyJWT, updateBook).delete(verifyJWT, deleteBook);

export default router;
