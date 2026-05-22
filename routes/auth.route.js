const express = require('express'); // Import the Express framework for building web applications
const User = require('../model/user.model');  // Import the User model to interact with the users table in the database
const { where } = require('sequelize');
const router = express.Router();  // Create a new router instance to define routes related to authentication



router.get('/login' , (req, res) => {
  res.render('login') // ./view/login.ejs
})  // Define a route for GET requests to /login that renders the login view (e.g., login.ejs)


router.get('/register', (req, res) => {
  res.render('register')

})

router.post('/login', async  (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({
    where: {
      email
    }
  })
// Define a route for POST requests to /login that handles user authentication by checking the provided email and password against the database records. It sends appropriate responses based on whether the user is found and if the password matches.


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



router.post('/register', async (req, res) => {
  const { email, password, firstname, lastname } = req.body

  const user = await User.findOne({
    where: {
      email 
    }
  })

  if (user) {
    res.render('register', {"errorMesage": "User already exist!"})
  } else { 
    const user = await  User.create({
      lastName: lastname,
      firstName: firstname,
      password,
      email
    })

    res.send('User registerd.')

  }
})
module.exports = router
