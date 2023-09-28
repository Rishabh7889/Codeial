const passport = require('passport');

const googleStrategy = require('passport-google-oauth').OAuth2Strategy;

const crypto = require('crypto');

const User = require('../models/user');

//tell passport to use a new strategy for google login
passport.use(new googleStrategy({
    clientID:"302869557354-7o9d4o1tqc1ltkgdfo1576dto5dh9tu3.apps.googleusercontent.com",
    clientSecret:"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",
    callbackURL: "http://localhost:8000/users/auth/google/callback"
    },
    function(accessToken,refreshToken,profile,done){
        User.findOne({email: profile.emails[0].value}).exec().then((user)=>{
            console.log(profile);

            if(user){
                //if found set this user as req.user
                return done(null,user);
            }else{
                // If not found create the user and set it as request.user
                User.create({
                    name:profile.displayName,
                    email:profile.emails[0].value,
                    password:crypto.randomBytes(20).toString('hex')
                }).then((user)=>{
                    return done(null,user);
                }).catch((err)=>{
                    console.log("Error increating user google strategy passport",err);
                    return;
                })
            }
        }).catch((err)=>{
            console.log("Error in google strategy passport",err);
            return;
        })
    }

));

module.exports = passport;