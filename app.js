require('dotenv').config()
const { Router } = require('express');
const express = require('express');
const app = express();
const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })

const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

app.use(express.json())
const recordsRouter = require('./routes/records')
app.use('/records', recordsRouter)

app.listen(3000, ( ) => {
    console.log("Server is running on localhost3000");
});