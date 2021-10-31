const express = require('express');
const routes = require('./controller/routes');
const mongoose = require('mongoose');
const uri = require('./config/mongoKey');
const csrf = require('csurf');
const expressSession = require('express-session');

const app = express();

app.use(express.urlencoded({ extended: true},),);

app.set('view engine','ejs');
app.set('views', __dirname + '/views');

app.use(routes);

app.use(expressSession({
    secret : "random",
    resave: true,
    saveUninitialized: false,
    maxAge: 60*1000,
     
}));

app.use(csrf());

 //connect to mongo
 mongoose.connect(uri, { useNewUrlParser :true, useUnifiedTopology :true, useFindAndModify: false, useCreateIndex : true, }).then(() => console.log("Connected !"),);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log("Started on PORT : " + PORT,),);