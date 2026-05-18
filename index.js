const express = require('express');
const birdsRouter = require('./routes/birds.route');
const sequelize = require('./database/sequelize-connect');
const User = require('./model/user.model');
const { FORCE } = require('sequelize/lib/index-hints');

const app = express();
const port = 3000;

//app.use('/birds', birdsRouter); 


app.get('/', (req, res) => {
  const users = User.findAll(); 
  res.send(users);  
});


app.get('/create-user', async(req, res) => {
  const user = await User.create({
    firstName: 'John',
    lastName: 'Doe',
    password: 'password123',
    email: 'john.doe@example.com'
  });
  res.send(user);
});


app.listen(port, async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
    console.log('Connection has been established successfully.');
    console.log(`Example app listening at http://localhost:${port}`);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}); 
