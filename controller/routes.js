const express = require('express');
const router = express.Router();

router.get('/',(req,res) => {
    res.render("index");
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
        res.render("signup", {err:"All set"});
    }
});

module.exports = router;