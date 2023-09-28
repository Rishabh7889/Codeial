const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy

const User = require('../models/user');

//authentication using passport
passport.use(new LocalStrategy({
    usernameField:'email',
    passReqToCallback: true
    },
    function(req,email,password,done){
        // find a user and establish the identity
        User.findOne({email:email}).then((user)=>{

            if(!user || user.password != password){
                console.log("Invalid Password");
                req.flash("error","invalid Username/Password");
                return done(null,false);
            }

            return done(null,user);
        }).catch((err)=>{
            req.flash('error',err)
            console.log(err);
        });
    }
));



//Serializing the user to decide which key is to be kept in the cookie
passport.serializeUser(function(user,done){
    return done(null,user.id);
});




//desearializing the user from the key in the cookies
passport.deserializeUser(function(id,done){
    User.findById(id).then((user)=>{
        return done(null,user);
    }).catch((err)=>{
        console.log("Error in finding the user -->Passport")
        return done(err);
    });
})


// Check if the user is authenticated or not?
passport.checkAuthentication = function(req,res,next){
    // if the user is signed in pass it on to the next function.
    if(req.isAuthenticated()){
        return next();
    }
    //if the user is not signed in
    return res.redirect('/users/sign-in');
};

passport.setAuthenticatedUser = function(req,res,next){
    if(req.isAuthenticated()){
        //req.user contains the current signed in user from the session cookie and we are just sending this to the locals for the views.
        res.locals.user = req.user;
    }
    next();
};

module.exports = passport;