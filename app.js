require('dotenv').config()
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const express = require('express');
const app = express();
const mongoose = require('mongoose');
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
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(methodOverride('X-HTTP-Method-Override'))
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(methodOverride('_method'))

const usersRouter = require('./routes/users').router
app.use('/users', usersRouter)

const recordsRouter = require('./routes/records')
app.use('/records', recordsRouter)
app.set('view engine', 'ejs');

path = require('path')

app.use('/css', express.static(path.join(__dirname, '/css')));
app.use("/static", express.static('./static/'));

app.get("/register", (req, res) =>{
    res.render("register.ejs")
})
app.get("/", (req, res) => {
    //res.render("index.ejs", {data : req.data})
    res.redirect("/home")
})
app.get("/login", (req, res) =>{
    res.render("login.ejs")
  })
app.get("/home", (req, res) => {
    res.render("home.ejs")
})
app.get("/lol", (req, res) => {
    res.render("index.ejs", {data : req.data})
})

app.get("/users/details", async(req, res) => {
    res.render("detailsUser.ejs")
})
server.listen(3000, () => { console.log('listening on 3000') });