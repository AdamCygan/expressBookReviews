const express = require('express');
const axios = require('axios');
let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;
const public_users = express.Router();

async function getBooksWithAxios(apiUrl) {
  const response = await axios.get(apiUrl);
  return response.data;
}

async function getBookByISBNWithAxios(apiUrl, isbn) {
  const baseUrl = apiUrl.replace(/\/$/, '');
  const response = await axios.get(
    `${baseUrl}/isbn/${encodeURIComponent(isbn)}`
  );
  return response.data;
}

async function getBooksByAuthorWithAxios(apiUrl, author) {
  const baseUrl = apiUrl.replace(/\/$/, '');
  const response = await axios.get(
    `${baseUrl}/author/${encodeURIComponent(author)}`
  );
  return response.data;
}

async function getBooksByTitleWithAxios(apiUrl, title) {
  const baseUrl = apiUrl.replace(/\/$/, '');
  const response = await axios.get(
    `${baseUrl}/title/${encodeURIComponent(title)}`
  );
  return response.data;
}

function userExists(username) {
  const isUsernameInDatabase = users.filter((usr) => usr.username === username);

  return isUsernameInDatabase.length > 0;
}

public_users.post('/register', (req, res) => {
  // Take username and password from the body
  const username = req.body.username;
  const password = req.body.password;

  // Check whether username and password are provided
  if (!username || !password) {
    return res
      .status(404)
      .json({ message: 'Username or password are missing.' });
  }

  // Check if username already exists
  if (userExists(username)) {
    return res.status(404).json({ message: 'User already exists!' });
  }

  // If not add user to the users
  const newUser = {
    username: username,
    password: password
  };

  users.push(newUser);

  return res.status(200).json({ message: 'User successfully registered.' });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: 'Book not found.' });
  }

  return res.status(200).send(book);
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;

  const filteredBooks = Object.values(books).filter(
    (book) => book.author.toLowerCase() === author.toLowerCase()
  );

  if (filteredBooks.length === 0) {
    return res.status(404).json({ message: 'No books found for this author.' });
  }

  return res.status(200).send(filteredBooks);
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;

  const filteredBooks = Object.values(books).filter(
    (book) => book.title.toLowerCase() === title.toLowerCase()
  );

  if (filteredBooks.length === 0) {
    return res.status(404).json({ message: 'No books found for this title.' });
  }

  return res.status(200).send(filteredBooks);
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: 'Book not found.' });
  }

  const bookReviews = book.reviews;

  return res.status(200).send(bookReviews);
});

module.exports.general = public_users;
module.exports.getBooksWithAxios = getBooksWithAxios;
module.exports.getBookByISBNWithAxios = getBookByISBNWithAxios;
module.exports.getBooksByAuthorWithAxios = getBooksByAuthorWithAxios;
module.exports.getBooksByTitleWithAxios = getBooksByTitleWithAxios;
