const express = require('express')
const path = require('path')
const hbs = require('hbs')
const Register = require('./models/registers')
const bcrypt = require('bcrypt')

require('./db/conn')

const app = express()
app.use(express.urlencoded({ extended: false }))

const port = process.env.PORT || 3000

const static_path = path.join(__dirname, '../public')
const template_path = path.join(__dirname, '../templates/views')
const partials_path = path.join(__dirname, '../templates/partials')

app.use(express.static(static_path))
app.set('view engine', 'hbs')
app.set('views', template_path)
hbs.registerPartials(partials_path)

app.get('/', (req, res) => {
  // console.log('hello all of u')
  res.render('index')
})

app.get('/register', (req, res) => {
  res.render('register')
})

// create a new user in our database
app.post('/register', async (req, res) => {
  try {
    const password = req.body.password
    const cpassword = req.body.confirmpassword
    if (password === cpassword) {
      const registerEmployee = new Register({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        gender: req.body.gender,
        phone: req.body.phone,
        age: req.body.age,
        password: password,
        confirmpassword: cpassword,
      })
      const registered = await registerEmployee.save()
      res.status(201).render('index')
    } else {
      res.send('password not matching')
    }
  } catch (error) {
    res.status(400).send(error)
  }
})

// login page
app.get('/login', (req, res) => {
  res.render('login')
})

// login check
app.post('/login', async (req, res) => {
  try {
    const email = req.body.email
    const password = req.body.password
    const userEmail = await Register.findOne({ email })

    const isMatch = await bcrypt.compare(password, userEmail.password)

    if (isMatch) {
      res.status(201).render('index')
    } else {
      res.send('invalid password details')
    }
  } catch (error) {
    res.status(400).send('invalid login details')
  }
})

app.listen(port, (req, res) => {
  console.log(`connection is set up at ${port}`)
})
