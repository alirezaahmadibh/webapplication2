const { Sequelize } = require('sequelize');

// Create a new Sequelize instance
const sequelize = new Sequelize('test2', 'modern', '1', {
  host: 'localhost',
  dialect: 'mysql' // Choose your database dialect (e.g., 'mysql', 'postgres', 'sqlite', etc.)
});



module.exports = sequelize; 