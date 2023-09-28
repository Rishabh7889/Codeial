const express = require("express");

const router = express.Router();

const passport = require('passport');

const UserProfileController = require("../controllers/users_controller");

router.get('/profile/:id',passport.checkAuthentication,UserProfileController.profile);
router.post('/update/:id',passport.checkAuthentication,UserProfileController.update);

router.get('/sign-up',UserProfileController.signUp);

router.get('/sign-in',UserProfileController.signIn);

router.post('/create',UserProfileController.create);


// use passport as a middleware to authenticate.
router.post('/create-session',passport.authenticate(
    'local',
    {failureRedirect:'/users/sign-in'},
),UserProfileController.createSession);

router.get('/sign-out',UserProfileController.destroySession)

router.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}));

router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/users/sign-in'}),UserProfileController.createSession);

module.exports = router;