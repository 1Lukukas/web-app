const express = require('express')
const router = express.Router()
const User = require('../models/user')

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

module.exports = router