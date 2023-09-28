const mongoose = require("mongoose");


// We are using Multer and path for file upload
// (User profile picture in this case.)
const multer = require("multer");
const path = require('path');

const AVATAR_PATH = path.join('/uploads/users/avatars');





const userSchema = mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    avatar:{
        type:String
    }
    }, {
        timestamps:true
     });




     //Muter storage Function
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'..',AVATAR_PATH));
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  });
  

//Static 
userSchema.statics.uploadedAvatar = multer({storage:storage}).single('avatar');
userSchema.statics.avatarPath = AVATAR_PATH;
const User = mongoose.model('User',userSchema);

module.exports = User;