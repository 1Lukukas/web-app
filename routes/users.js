const express = require('express')
const router = express.Router()
const User = require('../models/user')
const env = require('dotenv')
const jwt = require('jsonwebtoken')

path = require('path')
router.use('/css', express.static(path.join(__dirname, '/css')))
router.use('/static', express.static(path.join(__dirname, '/static')))

urlencodedParser = express.urlencoded({extended : false})

router.post('/create', urlencodedParser, async (req, res) => {
    const user = new User({
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
    })
    try {
      const newUser = await user.save()
      res.status(204).json(newUser)
    } catch (err) {
      res.status(400).json({ message: err.message })
    }
})

router.get('/all', async (req, res) => {
    try {
      const users = await User.find()
      res.json(users)
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
})

// router.post('/login', async (req, res) => {
//   const user = user.find(user => user.name === req.body.name)
//   if (user == null) {
//     return res.status(400).send('Cannot find user')
//   }
//   try {
//     if(req.body.password == user.password) {
//       res.send('Success')
//     } else {
//       res.send('Not Allowed')
//     }
//   } catch {
//     res.status(500).send()
//   }
// })

// let refreshTokens = []

// router.delete('/logout', (req, res) => {
//   refreshTokens = refreshTokens.filter(token => token !== req.body.token)
//   res.sendStatus(204)
// })

// router.post('/token', (req, res) => {
//   const refreshToken = req.body.token
//   if (refreshToken == null) return res.sendStatus(401)
//   if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
//   jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
//     if (err) return res.sendStatus(403)
//     const accessToken = generateAccessToken({ name: user.name })
//     res.json({ accessToken: accessToken })
//   })
// })

router.post('/login', (req, res) => {
  // Authenticate User

  const username = req.body.username
  const user = { username: username }

  const accessToken = generateAccessToken(user)
/*   const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
  refreshTokens.push(refreshToken) */
  res.json({ accessToken: accessToken/* , refreshToken: refreshToken  */})
})

router.get("/me", authenticateToken, async (req, res) =>{
  const user = await User.find({username: req.user.username})
  res.send(user[0])
})

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET/* , { expiresIn: '15s' } */)
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      console.log(err)
      return res.sendStatus(403)
    }
    req.user = user
    next()
  })
}

module.exports = {
  router,
  authenticateToken,
  }