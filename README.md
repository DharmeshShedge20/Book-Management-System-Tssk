# Book-Management-System-Tssk


 Introduction
The Book Management System is a simple CRUD-based application built using Node.js, Express, MongoDB, and React.js. It allows users to manage books by adding, editing, viewing, and deleting them through a web interface and API.


 Features
 CRUD Operations: Add, update, view, and delete books.
 JWT Authentication.
 MongoDB Database for storing book records.
 Vite + React Frontend for an interactive user experience.
 RESTful API with proper error handling.


Backend
Node.js, Express.js, MongoDB with Mongoose, JWT Authentication 
Frontend
Vite + React.js ,Material-UI, Axios for API requests


User API Endpoints

POST	/api/auth/register	 Register a new user	      
POST	/api/auth/login	     Login user and get tokens
POST	/api/auth/logout	   L ogout user	             


Book API Endpoints

GET	     /api/book/books	         Retrieve all books	              
POST	   /api/book/books	         Add a new book	                   
GET	     /api/book/books/:id	     Retrieve a single book by ID	    
PUT	     /api/book/books/:id	     Update an existing book by ID	   
DELETE	 /api/book/books/:id	     Delete a book by ID	              



Register User 
Purpose: Create a new user account.

🔹 How It Works:
The user sends full name, email, and password to register.
The password is hashed using bcrypt before saving.
A new user is stored in the database.
The response includes user details (excluding password).


Login User 
Purpose: Authenticate the user and issue an access token.

🔹 How It Works:
The user provides email and password.
The system validates credentials and checks if the password is correct.
A JWT access token is generated.
The access token is stored in an HTTP-only cookie for security.


 Logout User 
 Purpose: End user session and remove access token.

🔹 How It Works:
The system clears the access token cookie from the user's browser.
The user is logged out and must log in again to get a new token.



Add a New Book 
Purpose: Allows a logged-in user to add a new book to their collection.

🔹 How It Works:
The user must be logged in (access token required).
The request includes title, author, ISBN, and the published date is automatically generated.
The book is linked to the logged-in user using their user._id.
The system saves the book in the database and returns a success response.


Get All Books 
Purpose: Fetch all books that belong to the logged-in user.

🔹 How It Works:
Books of that user shown on dashboard 
The user must be logged in (access token required).
The system retrieves all books where owner = req.user._id.
If the user has no books, it returns an appropriate message.


Update a Book 
Purpose: Allows a logged-in user to update the details of their own book.

🔹 How It Works:
The user must be logged in (access token required).
There is a button to update book information
If the book belongs to the user, the title, author, and ISBN can be updated.
The system saves the updated book and returns a success response.


Delete a Book 
Purpose: Allows a logged-in user to delete their own book.

🔹 How It Works:
The user must be logged in (access token required).
There is a button to delete book


 Authentication & Access Control
Every book is linked to a specific user (field: owner = req.user._id).
Users can only view, edit, and delete their own books.
Protected routes:
Creating, retrieving, updating, and deleting books require authentication.
The system validates the access token before processing any request.
