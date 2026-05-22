const express = require('express'); // const bodyParser = require('body-parser'); // Not needed in Express 4.16+ as it has built-in body parsing
const sequelize = require('./database/sequelize-connect'); // Import the Sequelize instance
const User = require('./model/user.model'); // Import the User model
const authRoutes = require('./routes/auth.route'); // Import the authentication routes
const path = require('path'); // Import the path module for handling file paths
const app = express(); // Create an instance of the Express application
const port = 3000; // Define the port number for the server to listen on

app.use(express.urlencoded({ extended: true})); // Middleware to parse URL-encoded bodies (for form submissions)
app.use(express.json()); // Middleware to parse JSON bodies (for API requests)
app.use('/auth', authRoutes ) // Use the authentication routes for any requests starting with /auth


app.set('view engine', 'ejs') // Set the view engine to EJS for rendering views (e.g., login page)
app.set('views', path.join(__dirname, 'views')) // Set the directory for the views to be the 'views' folder in the current directory


app.get('/', async (req, res) => {
  res.send({message : " Welcome "})
}); // Define a route for the root URL that sends a welcome message as a JSON response



app.listen(port, async () => { 
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('Connection has been established successfully.');
    console.log(`Example app listening at http://localhost:${port}`);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});   // Start the server and listen on the defined port, while also establishing a connection to the database and syncing the models.
