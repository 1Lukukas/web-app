require('dotenv').config()
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const router = require('./routes/records');
const methodOverride = require('method-override');

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

app.use(methodOverride('X-HTTP-Method-Override'))
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(methodOverride('_method'))

const recordsRouter = require('./routes/records')
app.use('/records', recordsRouter)
app.set('view engine', 'ejs');


const getAllRecords = async (req, res, next) => {
    axios = require('axios');
    response = await axios.get('http://localhost:3000/records/all')
    req.data = response.data
    next()
}
app.use(getAllRecords)

app.get("/", (req, res) => {
    res.render("index.ejs", {data : req.data})
})

app.post("/edit", urlencodedParser, (req, res) => {
    var _id = req.body._id;
    console.log(req.body)
    res.render("editRecord.ejs", {data : req.data})
})

app.use("/static", express.static('./static/'));
app.listen(3000, ( ) => {
    console.log("Server is running on localhost3000");
});