module.exports = (database) =>{
    const express = require('express');
    const app = express();
    const methodOverride = require('method-override');
    const mongoose = require('mongoose');

    mongoose.connect(database, { useNewUrlParser: true })
    const db = mongoose.connection
    db.on('error', (error) => console.error(error))
    db.once('open', () => console.log('Connected to Database'))

    app.use(methodOverride('X-HTTP-Method-Override'))
    app.use(express.json())
    app.use(express.urlencoded({extended : true}))
    app.use(methodOverride('_method'))

    const usersRouter = require('./routes/users').router
    app.use('/users', usersRouter)

    const recordsRouter = require('./routes/records')
    app.use('/records', recordsRouter)

    const path = require('path')
    app.use('/css', express.static(path.join(__dirname, '/css')));
    app.use("/static", express.static('./static/'));

    app.set('view engine', 'ejs');

    app.get("/register", (req, res) =>{
        res.render("register.ejs")
    })
    app.get("/", (req, res) => {
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
    return app
};


