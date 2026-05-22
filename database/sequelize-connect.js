const { Sequelize } = require('sequelize'); // Import the Sequelize constructor from the sequelize package to create a new Sequelize instance for database connection

// Create a new Sequelize instance
const sequelize = new Sequelize('test2', 'modern', '1', {
  host: 'localhost',
  dialect: 'mysql' // Choose your database dialect (e.g., 'mysql', 'postgres', 'sqlite', etc.)
});


// Export the Sequelize instance to be used in other parts of the application, such as in models or routes, to establish a connection to the database and perform database operations.
module.exports = sequelize; 