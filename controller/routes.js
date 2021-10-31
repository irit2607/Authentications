const express = require('express');
const router = express.Router();
const user = require('../model/user');
const bcryptjs = require('bcryptjs')
const passport = require('passport');
require('./passportLocal')(passport);


function checkAuth(req, res, next) {
    if (req.isAuthenticated()) {
        res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0');
        next();
    } else {
        req.flash('error_messages', "Please Login to continue !");
        res.redirect('/login');
    }
}

router.get('/',(req,res) => {
    if (req.isAuthenticated()) {
        res.render("index", { logged: true });
    } else {
        res.render("index", { logged: false });
    }
});

router.get('/login',(req,res) => {
    res.render("login");
});

router.get('/signup',(req,res) => {
    res.render("signup", { });
});

router.get('/profile',(req,res) => {
    res.render('profile');
});

router.post('/signup',(req,res) => {
    // get all the values
    const {email, username, password, confirmpassword } = req.body;

    // check if the one empty

    if(!email || !username || !password || !confirmpassword){
        res.render("signup", {err : "All fields are required" });
    } else if(password != confirmpassword){
        res.render("signup", {err :"Password don't match"});
    }else{
        // res.render("signup", {err:"All set"});
       
        user.findOne({ $or : [ {email:email}, {username : username} ] }, function(err,data){
            if(err) throw err;
            if(data){
                res.render("signup", {err :"User Exists!! Logging in"});
            }
            else
            {
                   //generate a salt
                   bcryptjs.genSalt(12,(err,salt) => {
                       if(err) throw err;
                       //hash the password
                       bcryptjs.hash(password, salt, (err,hash) => {
                           if(err) throw err;
                           user({
                               username: username,
                               email : email,
                               password : hash,
                               googleId: null,
                               provide: 'email',
                            
                           }).save((err, data) => {
                               if(err) throw err;
                               res.redirect('/login')
                           });
                       })
                   });
            }
        })

    }
});

router.get('/logout', (req, res) => {
    req.logout();
    req.session.destroy(function (err) {
        res.redirect('/');
    });
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        failureRedirect: '/login',
        successRedirect: '/profile',
        failureFlash: true,
    })(req, res, next);
});

router.get('/profile', checkAuth, (req,res) => {
   
        res.render('profile',{ username: req.user.username });
    
   
});

module.exports = router;