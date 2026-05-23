const express = require('express'); // Import the Express framework for building web applications
const User = require('../model/user.model');  // Import the User model to interact with the users table in the database
const router = express.Router();  // Create a new router instance
const jwt = require('jsonwebtoken');

router.get('/login', (req, res) => {
  res.render('login'); // ./views/login.ejs
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const secretkey = 'your_secret_key';
  const user = await User.findOne({
    where: {
      email
    }
  });

  if (user) {
    if (user.password == password) {
      const payload = {
        id: user.id,
        email: user.email
      };

      const token = jwt.sign(payload, secretkey, {
        expiresIn: '3h',
      });

      res.cookie('token', token, {
        maxAge: 3 * 60 * 60 * 1000,
        path: '/'
      });

      res.redirect("/user/profile");

    } else {
      res.render('login', { errorMessage: "the Password is incorrect" });
    }
  } else {
    res.render('login', { errorMessage: "the email is incorrect" });
  }
});

router.post('/register', async (req, res) => {
  const { email, password, firstname, lastname } = req.body;

  const user = await User.findOne({
    where: {
      email
    }
  });

  if (user) {
    res.render('register', { errorMessage: "User already exist!" });
  } else {
    const user = await User.create({
      lastName: lastname,
      firstName: firstname,
      password,
      email
    });

    res.send('User registered.');
  }
});

module.exports = router;
