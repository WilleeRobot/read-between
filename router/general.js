const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  // Normalizing the author name from client
  const author = req.params.author.toLowerCase().replace(/[\s-]+/g, "");

  // Defining an object to store the books of the author
  let authorBooks = {};

  // Checking if the author query param is invalid
  if (!author) {
    return res.status(404).json({ message: "Author not found" });
  }

  // Iterating through the books database to find the books of the author
  for (let book in books) {
    // Normalizing the author name from the books database
    const bookAuthor = books[book].author.toLowerCase().replace(/[\s-]+/g, "");

    // Checking if the author of the book matches the author from the client
    if (bookAuthor === author) {
      authorBooks[book] = books[book];
    }
  }

  // Returning the books of the author

  // If the author has books, return the books
  if (Object.keys(authorBooks).length > 0) {
    return res.status(200).json(authorBooks);
  } else {
    return res.status(404).json({ message: "Author not found" });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  // Normalizing the title name from client
  const title = req.params.title.toLowerCase().replace(/[\s-]+/g, "");
  let returnedBook = {};

  // Checking if the title exists in the books database
  if (!title) {
    return res.status(404).json({ message: "Title not found" });
  }

  // Iterating through the books database to find the book with the title
  for (let book in books) {
    // Normalizing the title name from the books database
    const booktitle = books[book].title.toLowerCase().replace(/[\s-]+/g, "");

    // Checking if the title of the book matches the title from the client
    if (booktitle === title) {
      returnedBook[book] = books[book];
      return res.status(200).json(returnedBook);
    }
  }

  // If the title is not found, return a 404 status code
  return res.status(404).json({ message: "Title not found" });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    if (Object.keys(books[isbn].reviews).length === 0) {
      return res.status(200).json({ message: "No reviews for this book yet." });
    } else {
      return res.status(200).json(books[isbn].reviews);
    }
  }

  return res.status(404).json({ message: "Book not found" });
});

module.exports.general = public_users;
