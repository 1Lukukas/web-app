const express = require('express')
const router = express.Router()
const Record = require('../models/record')
const User = require('../models/user')
const { authenticateToken, authenticationHeader } = require('./users')

path = require('path')
router.use('/css', express.static(path.join(__dirname, '/css')))
router.use('/static', express.static(path.join(__dirname, '/static')))

urlencodedParser = express.urlencoded({extended : false})
const cookieParser = require('cookie-parser');
router.use(cookieParser());
// Getting all

router.get('/all2', authenticateToken, async (req, res) => {
  try {
    let records = await Record.find()
    records = records.filter((record) => {
      return record.username == req.user.username})
    res.json(records)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/all', async (req, res) => {
  try {
    const records = await Record.find()
    res.json(records)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Getting One
router.get('/:id', getRecord, (req, res) => {
  res.status(204).json(res.record)
})

router.get("/:id/details", getRecord, async(req, res) => {
  res.render("detailsRecord.ejs", {data : res.record})
})

// Creating one
router.post('/create', urlencodedParser, async (req, res) => {
  const record = new Record({
    amount: req.body.amount,
    currency: req.body.currency,
    category: req.body.category,
    description: req.body.description,
    recordType: req.body.recordType,
    recordDate: req.body.recordDate
  })
  try {
    const newRecord = await record.save()
    res.status(204).json(newRecord)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.post('/create2', urlencodedParser, authenticateToken, async (req, res) => {
  //console.log(req.user)
    const user = await User.find({username: req.user.username})
    const record = new Record({
    amount: req.body.amount,
    currency: req.body.currency,
    category: req.body.category,
    description: req.body.description,
    recordType: req.body.recordType,
    recordDate: req.body.recordDate,
    username: user[0].username
  });

  try {
    newRecord = await record.save()
    temp = user[0].records
    temp.push(newRecord)
    user[0].records = temp
    await user[0].save()

    res.status(204).json(newRecord)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Pass id to edit record page
router.get("/:id/edit", getRecord, async(req, res) => {
  res.render("editRecord.ejs", {data : res.record})
})

// Updating One
router.patch('/:id', getRecord, async (req, res) => {
  if (req.body.amount != null) {
    res.record.amount = req.body.amount
  }
  if (req.body.currency != null) {
    res.record.currency = req.body.currency
  }
  if (req.body.currency != null) {
    res.record.category = req.body.category
  }
  if (req.body.description != null) {
    res.record.description = req.body.description
  }
  if (req.body.recordType != null) {
    res.record.recordType = req.body.recordType
  }
  if (req.body.recordDate != null) {
    res.record.recordDate = req.body.recordDate
  }
  try {
    const updatedRecord = await res.record.save()
    res.status(204).json(updatedRecord)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Deleting One
router.delete('/:id', getRecord, async (req, res) => {
  try {
    await res.record.remove()
    res.message(`Record ${res.record._id} removed successfully`)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

async function getRecord(req, res, next) {
  let record
  try {
    record = await Record.findById(req.params.id)
    if (record == null) {
      return res.status(404).json({ message: 'Cannot find record' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  res.record = record
  next()
}

module.exports = router