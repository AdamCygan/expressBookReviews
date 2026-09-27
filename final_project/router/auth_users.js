const express = require('express');
const jwt = require('jsonwebtoken');
let books = require('./booksdb.js');
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
};

const authenticatedUser = (username, password) => {
  const existingUsers = users.filter((user) => {
    return user.username === username && user.password === password;
  });

  return existingUsers.length > 0;
};

//only registered users can login
regd_users.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check whether username and password are provided
  if (!username || !password) {
    return res
      .status(404)
      .json({ message: 'Username or password are missing.' });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(208).json({ message: 'Invalid credentials.' });
  }

  let accessToken = jwt.sign(
    {
      data: password
    },
    'access',
    { expiresIn: 60 }
  );

  req.session.authorization = {
    accessToken,
    username
  };

  return res.status(200).send('User successfully logged in.');
});

// Add a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
  return res.status(300).json({ message: 'Yet to be implemented' });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
