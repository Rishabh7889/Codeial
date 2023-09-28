const User = require('../models/user');
const fs = require('fs');
const path = require('path');


module.exports.profile = function(req,res){

    // CREATING A SESSION MANUALLY [WITHOUT USING PASSPORT LIBRARY].

    // if(req.cookies.user_id){
    //     User.findById(req.cookies.user_id).then((user)=>{
    //         console.log(user);
    //         if(user){
    //             console.log(user);
    //             return res.render('user_profile',{
    //                 title:"User Profile",
    //                 user:user
    //             })
    //         }
    //         return res.redirect('/users/sign-in');
    //     }).catch((err)=>{
    //         console.log(err);
    //     })
    // }else{
    //     return res.redirect('/users/sign-in');
    // }


    User.findById(req.params.id).then((user)=>{
        return res.render('user_profile',{
            title:"user profile",
            profile_user:user
        });
    }).catch((err)=>{
        console.log(err);
    })
}

module.exports.update = async (req,res)=>{
    // if(req.user.id == req.params.id){
    //     User.findByIdAndUpdate(req.params.id,req.body).then((data)=>{
    //         console.log(data);
    //         return res.redirect('back');
    //     }).catch((err)=>{
    //         console.log(err);
    //     })
    // }else{
    //     return res.status(401).send("Unauthorized");
    // }

    if(req.user.id == req.params.id){
        try{
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req,res,function(err){
                if(err){console.log("*****Multer error:",err)}

                // console.log(req.file);
                user.name = req.body.name;
                user.email = req.body.email;
                if(req.file){

                    // if(user.avatar){
                    //     fs.unlinkSync(path.join(__dirname,'..',user.avatar));
                    // }
                    // This is saving the path of the uplaod file into the avatar field in the user.
                    user.avatar = User.avatarPath + "/" + req.file.filename;
                }
                user.save();
                return res.redirect('back');

            })
        }catch(err){
            req.flash("error",err);
        console.log("Error in creating the post",err);
        }
    }else{

        req.flash('error','Unauthorised');
        return res.status(401).send("Unauthorized");

    }
}


module.exports.signUp = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_up',{
        title:"Codeial | Sign Up"
    })
}


module.exports.signIn = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    
    return res.render('user_sign_in',{
        title:"Codeial | Sign In"
    })
}


//get the sign up data
module.exports.create = function(req,res){
    if(req.body.password != req.body.confirm_password){
        return res.redirect('back');
    }

    User.findOne({email:req.body.email}).then((user)=>{
       
        if(!user){
            User.create(req.body).then((data)=>{
                console.log(data)
                return res.redirect('/users/sign-in'); 
            }).catch((err)=>{
                console.log(err);
            })
        }else{
            return res.redirect('back');
        }
    }).catch((err)=>{
        if(err){
            console.log("error in finding user in signing up");
            return;
        }
    });
}

//Sign in the user and create a session
module.exports.createSession = function(req,res){
    // Steps to authenticate
    // Find the User
    // User.findOne({email: req.body.email}).then((user)=>{
    //     // Handle user found
    //     if(user){

    //         // Handle password don't match
    //         if(user.password != req.body.password){
    //             return res.redirect('back');
    //         }
    //         // Handle session creation
    //         res.cookie('user_id',user.id);
    //         return res.redirect('/users/profile');
    //     }else{
    //         // Handle user not found
    //         res.redirect('back');
    //     }
    // })


    //session creation using the passport:
    req.flash('success','Logged in Successfully');
    return res.redirect('/');


}


module.exports.destroySession = function(req,res){
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success','You have logged out');

        return res.redirect('/');
      });
}
