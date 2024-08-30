const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register new user
public_users.post("/register", (req,res) => {
    const { username, password } = req.body;

    // Check if the username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    // Check if the username already exists
    const userExists = users.find(user => user.username === username);
    if (userExists) {
        return res.status(409).json({ message: "Username already exists." });
    }

    // Add the new user to the users list
    users.push({ username, password });

    return res.status(201).json({ message: "User registered successfully." });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//     // Retrieve the ISBN from the request parameter
//     const isbn = req.params.isbn;
//     res.send(books[isbn]);
//   return res.status(300).json({message: "Yet to be implemented"});
//  });

 public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    // Assuming you have a books object or a database to retrieve the book details
    const book = books[isbn]; // or however you store your books data

    if (book) {
        res.json(book);
    } else {
        res.status(404).json({ message: 'Book not found' });
    }
});
  
// Get book details based on author
// public_users.get('/author/:author',function (req, res) {
    // const author = req.params.author;
    // books.map()
    // res.send(books[author]);
  //Write your code here
  public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const booksByAuthor = [];

    // Assuming `books` is an object where each key is an ISBN and each value is a book object
    for (const isbn in books) {
        if (books[isbn].author === author) {
            booksByAuthor.push(books[isbn]);
        }
    }

    if (booksByAuthor.length > 0) {
        res.json(booksByAuthor);
    } else {
        res.status(404).json({ message: 'Books by this author not found' });
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const booksByTitle = [];

    // Assuming `books` is an object where each key is an ISBN and each value is a book object
    for (const isbn in books) {
        if (books[isbn].title === title) {
            booksByTitle.push(books[isbn]);
        }
    }

    if (booksByTitle.length > 0) {
        res.json(booksByTitle);
    } else {
        res.status(404).json({ message: 'Books by this title not found' });
    }
});

//  Get book review
// public_users.get('/review/:isbn',function (req, res) {
//   //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
// });

public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn]; // Assuming `books` is an object where ISBNs map to book details

    if (book && book.reviews) {
        res.json(book.reviews);
    } else {
        res.status(404).json({ message: 'Reviews not found for this book' });
    }
});


module.exports.general = public_users;
