const express = require('express')
const mysql = require('mysql')
const path = require('path');
const articleRouter = require('./routes/articles')
const Article = require('./models/articles')
const bodyparser = require('body-parser')
const session = require("express-session")
const {v4 : uuidv4} = require("uuid")
const methodOverride = require('method-override')
const app = express()


app.use(bodyparser.urlencoded({extended : true}))
app.set('view engine', 'ejs')
app.use('/static',express.static(path.join(__dirname,'public')))
app.use(methodOverride('_method'))
app.use(session({
    secret: uuidv4(),
    resave: false,
    saveUninitialized: true
}));
app.use('/',articleRouter)


app.listen(3030, console.log('Listening to port 3030'))