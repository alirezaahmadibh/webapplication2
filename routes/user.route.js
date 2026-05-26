const express = require('express'); // Import the Express framework to create a web application and define routes for handling HTTP requests
const router = express.Router(); // Create a new router instance to define routes related to user profiles and other user-related functionalities
const jwt = require('jsonwebtoken'); // Import the jsonwebtoken library to handle JWT token creation and verification   
const User = require('../model/user.model');// Import the User model to interact with the users table in the database and perform operations such as finding a user by ID or email, and retrieving user information for the profile page
const { requireAuth } = require('../middlewares/auth.middleware')
const multer = require('multer')

router.get('/profile', requireAuth ,async (req, res) => {
    const user = await User.findOne({
        where: {
            email: res.locals.decoded.email
        }
    })
    if (user) {
        res.render('profile', { user })
    } else {
        res.redirect("/auth/login")
    }

})

module.exports = router; // Export the router to be used in other parts of the application, such as in the main index.js file, to handle routes related to user profiles.