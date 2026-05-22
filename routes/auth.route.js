const express = require('express'); // Import the Express framework for building web applications
const User = require('../model/user.model');  // Import the User model to interact with the users table in the database
const router = express.Router();  // Create a new router instance to define routes related to authentication



router.get('/login' , (req, res) => {
  res.render('login') // ./view/login.ejs
})  // Define a route for GET requests to /login that renders the login view (e.g., login.ejs)


router.post('/login', async  (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({
    where: {
      email
    }
  })


  if (user) {
    if (user.password == password) {
      res.send("Hi to panel")
    } else {
       res.render('login', {errorMessage : "the Password is incorrect"})
    }
  } else {
      res.render('login', {"errorMessage": "the email is incorrect"})
  }
})  // Define a route for POST requests to /login that handles user authentication by checking the provided email and password against the database records. It sends appropriate responses based on whether the user is found and if the password matches.

router.get('/register', async (req, res) => {
  const user = await User.create({firstName: "Alireza", lastName: "Ahmadi", email: "info@owasp.com", password: "1"})
  res.send(user)
})  // Define a route for GET requests to /register that creates a new user with hardcoded values and sends the created user as a response. This is likely for testing purposes and should be replaced with proper registration logic in a real application.

module.exports = router
