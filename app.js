const express = require("express");
const app = express();
const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })

const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

app.use(express.json())
app.set('view engine', 'ejs')

app.use(express.urlencoded({extended : true}))
app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.listen(3000, function () {
    console.log("Server is running on localhost3000");
});