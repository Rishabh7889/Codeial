const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();

const port = 8000;

const db = require('./config/mongoose');


// Making the chat sevrer.
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5500);
console.log('chat server is listening on port 5000');

//used for authentication.
const session = require('express-session');
const pasportLocat = require('./config/passport-local-strategy');
const passport = require('passport');
const expressLayouts = require('express-ejs-layouts');
const MongoStore = require('connect-mongo');
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const customeMware = require('./config/middleware');

const passportJWT = require('./config/passport-jwt-strategy');

const passportGoogle = require('./config/passport-google-oauth2-strategy');

app.use(sassMiddleware({
    src: './assets/scss',
    dest:'./assets/css',
    debug: true,
    outputStyle:'extended',
    prefix: '/css'
}))

//middlewares
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Make the upload path available in the browser.
app.use('/uploads',express.static(__dirname+'/uploads'));

app.use(expressLayouts);

// Extract style and scripts from sub pages into the layout.
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);

app.use(express.static("./assets"));

app.set("view engine","ejs");
app.set("views",'./views');



//Mongo store is used to store the session cookie.
app.use(session({
    name: 'codeial',
    // TODO change the secret before deployment in production mode.
    secret: 'blahsomething',
    saveUninitialized: false,
    resave: false,
    cookie:{
        maxAge: (1000*60*100)
    },
    store: MongoStore.create({
        mongoUrl: 'mongodb://127.0.0.1:27017/codeial_development',
        autoRemove:'disabled'
    },function(err){
        console.log(err || "Connect-mongo db is connected");
    }
    )

}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customeMware.setFlash)
//use express router
app.use('/',require('./routes/index'));

app.listen(port,(err)=>{
    if(err){
        console.log(`Error:${err}`);
    }
    console.log(`Server is running on port ${port}`);
})