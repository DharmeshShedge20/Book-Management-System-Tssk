import { Book } from "../Model/Schema.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

//  Add a new book
const createBook = asyncHandler(async (req, res) => {
  const publishedDate = new Date();

  const { title, author, isbn } = req.body;
  if (!title || !author || !isbn) {
    throw new ApiError(400, "All fields are required");
  }
  const newBook = new Book({
    title,
    author,
    isbn,
    publishedDate,
    owner: req.user._id,
  });
  await newBook.save();
  res
    .status(201)
    .json(new ApiResponse(201, newBook, "Book created successfully"));
});

// Get all books
const getAllBooks = asyncHandler(async (req, res) => {
  const books = await Book.find({ owner: req.user._id });

  // if (!books) throw new ApiError(404, "No books found");
  if (books.length === 0) {
    // If the user has no books, return an empty array but with a success message
    return res
      .status(200)
      .json(new ApiResponse(200, [], "No books available yet"));
  }

  res
    .status(200)
    .json(new ApiResponse(200, books, "Books retrieved successfully"));
});

// Get a single book by ID
const getBookById = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) throw new ApiError(404, "Book not found");

  if (book.owner?.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized! You do not own this book.");
  }

  res
    .status(200)
    .json(new ApiResponse(200, book, "Book retrieved successfully"));
});

// Update a book by ID
const updateBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (!book) throw new ApiError(404, "Book not found");

  if (book.owner?.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized! You do not own this book.");
  }

  const { title, author, isbn } = req.body;
  const updatedBook = await Book.findByIdAndUpdate(
    req.params.id,
    { title, author, isbn },
    { new: true, runValidators: true }
  );
  res
    .status(200)
    .json(new ApiResponse(200, updatedBook, "Book updated successfully"));
});

//  Remove a book by ID
const deleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (!book) throw new ApiError(404, "Book not found");

  if (book.owner?.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized! You do not own this book.");
  }

  await book.deleteOne();
  res.status(200).json(new ApiResponse(200, null, "Book deleted successfully"));
});

export { getAllBooks, getBookById, createBook, updateBook, deleteBook };
