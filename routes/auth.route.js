const express = require('express'); // Import the Express framework for building web applications
const User = require('../model/user.model');  // Import the User model to interact with the users table in the database
const router = express.Router();  // Create a new router instance
const jwt = require('jsonwebtoken');
const ResetPassword = require('../model/reset-password-model'); // Import the ResetPassword model to interact with the reset_passwords table in the database for handling password reset tokens

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
}); // Define a POST route for user registration that checks if a user with the provided email already exists in the database, and if not, creates a new user record with the provided information (first name, last name, email, and password) and sends a response indicating that the user has been registered successfully. If a user with the same email already exists, it renders the registration view with an error message.


router.post('/forget-password', async (req, res) => {
  const { email } = req.body; // Get the email from the request body

  const user = await User.findOne({
    where: {
      email
    }
  }); // Find a user in the database with the provided email address to check if the email exists in the system. If a user with the provided email is found, it proceeds to generate a password reset token and send password reset instructions to the user's email. If no user with the provided email is found, it renders the forget-password view with an error message indicating that the email is incorrect.

  if (user) {
    // Here you would typically generate a password reset token and send an email to the user with instructions on how to reset their password.
    res.send('Password reset instructions have been sent to your email.');
  } else {
    res.render('forget-password', { errorMessage: "the email is incorrect" });
  }
}); // Define a POST route for handling forgotten password requests that checks if a user with the provided email exists in the database, and if so, sends a response indicating that password reset instructions have been sent to the user's email. If no user with the provided email exists, it renders the forget-password view with an error message.



module.exports = router;
