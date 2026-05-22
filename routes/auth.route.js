const express = require('express');
const User = require('../model/user.model');
const router = express.Router();



router.get('/login' , (req, res) => {
  res.render('login') // ./view/login.ejs
})


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
       res.send("the Password is incorrect")
    }
  } else {
      res.send("User not found!")
  }
})

router.get('/register', async (req, res) => {
  const user = await User.create({firstName: "Alireza", lastName: "Ahmadi", email: "info@owasp.com", password: "1"})
  res.send(user)
})

module.exports = router