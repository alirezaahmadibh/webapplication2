const express = require('express'); // const bodyParser = require('body-parser'); // Not needed in Express 4.16+ as it has built-in body parsing
const router = express.Router(); // Create a new router instance to define routes related to user profiles and other user-related functionalities
const jwt = require('jsonwebtoken'); // Import the jsonwebtoken library to handle JWT token creation and verification   
const User = require('../model/user.model');// Import the User model to interact with the users table in the database and perform operations such as finding a user by ID or email, and retrieving user information for the profile page

router.get('/profile', async (req, res) => {
    const token = req.cookies.token; // Get the JWT token from the cookies
    const secretkey = 'your_secret_key'; // Define the secret key used for signing and verifying the JWT token (should be the same as the one used during token creation)


    if (token) {
        try {
            const decoded = jwt.verify(token, secretkey); // Verify the token using the secret key and decode its payload to get the user information (e.g., user ID and email)
            const user = await User.findOne({
                where: {
                    id: decoded.id
                } // Find the user in the database using the ID from the decoded token
            }); // Find the user in the database using the ID from the decoded token

            if (user) {
                res.render('profile', { user });
            } else {
                res.redirect('/auth/login');
            }
        } catch (error) {
            console.error('Error verifying token:', error);
            res.redirect('/auth/login');
        }
    } else {
        res.redirect('/auth/login');
    }
}); // Define a route for the user profile page that checks for a valid JWT token in the cookies, verifies it, and retrieves the user information from the database to render the profile view. If the token is invalid or not present, it redirects to the login page.



module.exports = router; // Export the router to be used in other parts of the application, such as in the main index.js file, to handle routes related to user profiles.