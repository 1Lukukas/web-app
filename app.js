require('dotenv').config()
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const router = require('./routes/records');
const methodOverride = require('method-override');
const https = require('https');
const fs = require('fs');
const key = fs.readFileSync('key.pem');
const cert = fs.readFileSync('cert.pem');
const server = https.createServer({key: key, cert: cert }, app);

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
    response = await axios.get('https://localhost:3000/records/all')
    req.data = response.data
    next()
}
app.use(getAllRecords)

path = require('path')

app.use('/css', express.static(path.join(__dirname, '/css')));

app.get("/", (req, res) => {
    res.render("index.ejs", {data : req.data})
})

server.listen(3000, () => { console.log('listening on 3000') });