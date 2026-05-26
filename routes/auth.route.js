const express = require('express'); // Import the Express framework for building web applications
const User = require('../model/user.model');  // Import the User model to interact with the users table in the database
const router = express.Router();  // Create a new router instance
const jwt = require('jsonwebtoken'); // Import the jsonwebtoken library to handle JWT token creation and verification for authentication purposes
const ResetPassword = require('../model/reset-password-model'); // Import the ResetPassword model to interact with the reset_passwords table in the database for handling password reset tokens
const crypto = require('crypto'); // Import the crypto module to generate secure random tokens for password reset functionality
const mailgun = require('mailgun-js'); // Import the mailgun-js library to send emails for password reset instructions (not used in the provided code but can be implemented for sending emails)  
const formData = require('form-data'); // Import the form-data library to handle form data when sending emails with attachments (not used in the provided code but can be implemented for sending emails with attachments)  


function generateToken() {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(32, (err, buffer) => {
            if (err) {
                reject(err);
            } else {
                const token = buffer.toString('hex');
                resolve(token);
            }
        });
    });
} // Define a function named generateToken that returns a promise which generates a secure random token using the crypto module's randomBytes method. The generated token is returned as a hexadecimal string. This function can be used to create unique tokens for password reset functionality or other purposes where a secure token is needed. 



// Define routes for authentication-related functionalities such as login, registration, and password reset. These routes will handle HTTP requests related to user authentication and interact with the User and ResetPassword models to perform database operations as needed. The routes will also use JWT for token-based authentication and may include error handling for various scenarios (e.g., incorrect email or password, user already exists, etc.).

router.get('/login', (req, res) => {
  res.render('login'); // ./views/login.ejs
}); // Define GET routes for rendering the login and registration views. These routes will serve the corresponding EJS templates when accessed, allowing users to interact with the authentication pages of the application. The views will likely include forms for user input (e.g., email and password) that will be submitted to the corresponding POST routes for processing authentication requests.

router.get('/register', (req, res) => {
  res.render('register');
}); // Define GET routes for rendering the login and registration views. These routes will serve the corresponding EJS templates when accessed, allowing users to interact with the authentication pages of the application. The views will likely include forms for user input (e.g., email and password) that will be submitted to the corresponding POST routes for processing authentication requests.

router.get('/forget-password', (req, res) => {
  res.render('forget-password');
}); // Define GET routes for rendering the login, registration, and forget password views. These routes will serve the corresponding EJS templates when accessed, allowing users to interact with the authentication pages of the application. The views will likely include forms for user input (e.g., email and password) that will be submitted to the corresponding POST routes for processing authentication requests.



router.get('/forget-password/:token', (req, res) =>{
  res.render('password-change', {token:req.params.token })

})


router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const secretkey = 'your_secret_key';

  const user = await User.findOne({
    where: {
      email
    }
  }); // Define a POST route for handling user login requests. This route will receive the email and password from the request body, check if a user with the provided email exists in the database, and if so, compare the provided password with the stored password. If the credentials are valid, it will generate a JWT token, set it as a cookie in the response, and redirect the user to their profile page. If the credentials are invalid, it will render the login view with an appropriate error message indicating whether the email or password is incorrect.

  if (user) {
    if (user.password == password) {
      const payload = {
        id: user.id,
        email: user.email
      }; // If the user is found in the database and the provided password matches the stored password, create a payload object containing the user's ID and email. This payload will be used to generate a JWT token that can be used for authentication in subsequent requests.

      const token = jwt.sign(payload, secretkey, {
        expiresIn: '3h',
      }); // Generate a JWT token using the jsonwebtoken library's sign method, passing in the payload, secret key, and an expiration time of 3 hours. This token will be used for authenticating the user in future requests by including it in the request headers or cookies.

      res.cookie('token', token, {
        maxAge: 3 * 60 * 60 * 1000,
        path: '/'
      }); // Set the generated JWT token as a cookie in the response using the res.cookie method. The cookie is named 'token', has a maximum age of 3 hours (in milliseconds), and is accessible across the entire application (path: '/'). This allows the client to store the token and include it in subsequent requests for authentication purposes.

      res.redirect("/user/profile");

    } else {
      res.render('login', { errorMessage: "the Password is incorrect" });
    }
  } else {
    res.render('login', { errorMessage: "the email is incorrect" });
  }
}); // Define a POST route for handling user login requests. This route will receive the email and password from the request body, check if a user with the provided email exists in the database, and if so, compare the provided password with the stored password. If the credentials are valid, it will generate a JWT token, set it as a cookie in the response, and redirect the user to their profile page. If the credentials are invalid, it will render the login view with an appropriate error message indicating whether the email or password is incorrect.

router.post('/register', async (req, res) => {
  const { email, password, firstname, lastname } = req.body;

  const user = await User.findOne({
    where: {
      email
    }
  }); // Define a POST route for user registration that checks if a user with the provided email already exists in the database, and if not, creates a new user record with the provided information (first name, last name, email, and password) and sends a response indicating that the user has been registered successfully. If a user with the same email already exists, it renders the registration view with an error message.

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


router.post('/forget-password', async (req, res)=>{
  const {email} = req.body

  const user = await User.findOne({
    where: {
      email
    }
  })

  if (user) {
    const token = await generateToken()

    console.log(token)  

    await ResetPassword.create({
      email,
      token
    })

    console.log(token)
    res.send({"message": "ok"})
  } else {
      res.redirect('/auth/login')
  }
})

router.post('/forget-password/:token', async (req, res) => {
  const { token } = req.params; // Get the token from the URL parameters to identify the password reset request and verify its validity before allowing the user to reset their password. The token is typically generated and stored in the database when the user initiates a password reset request, and it is used to ensure that only authorized users can reset their passwords by verifying the token against the stored value in the database.
  const { password} = req.body

  const reset_password = await ResetPassword.findOne({
    where: {
      token
    }
  }) 

  if (reset_password) {
    const user = await User.findOne({
      where: {
        email: reset_password.email
      }
    })

    if (user){
      user.password = password
      await user.save()

      res.redirect('/auth/login')
     } else {
        res.redirect('/auth/login')
     }  
  } else {
      res.redirect('/auth/login')
  }
})

module.exports = router;
