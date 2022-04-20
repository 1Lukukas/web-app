const express = require('express')
const router = express.Router()
const Record = require('../models/record')


urlencodedParser = express.urlencoded({extended : false})
// Getting all
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
  res.json(res.record)
})

// Creating one
router.post('/create', urlencodedParser, async (req, res) => {
  const record = new Record({
    amount: req.body.amount,
    currency: req.body.currency,
    category: req.body.category,
    description: req.body.description,
    recordType: req.body.recordType
  })
  console.log("test")
  try {
    const newRecord = await record.save()
    res.status(204).json(newRecord)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
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
  try {
    const updatedRecord = await res.record.save()
    res.json(updatedRecord)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Deleting One
router.delete('/:id', getRecord, async (req, res) => {
  try {
    await res.record.remove()
    res.status(204).json({ message: 'Deleted Record' })
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