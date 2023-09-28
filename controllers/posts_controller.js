const Post = require('../models/post')
const Comment = require('../models/comment');
const Like = require('../models/like');

module.exports.create = (req,res)=>{
    Post.create({
        content: req.body.content,
        user: req.user._id
    }).then((post)=>{
        if (req.xhr){
            return res.status(200).json({
                data:{
                    post:post
                },
                message: "Post created"
            });
        }
        req.flash("success","Post published");
        return res.redirect('back');
    }).catch((err)=>{
        req.flash("error",err);
        console.log("Error in creating the post",err);
    });
}


module.exports.destroy = (req,res)=>{
    Post.findById(req.params.id).then((post)=>{

        if( post.user == req.user.id){
            console.log("Here is the post:",post);
            Like.deleteMany({
                likeable:post._id,
            }).then((data)=>{
                console.log(data);
            }).catch((err)=>{
                console.log(err);
            })

            // Like.deleteMany({
            //     _id:{$in:post.comments}
            // })
            Post.deleteMany({
                _id:req.params.id
            }).then((data)=>{
                req.flash("success","Post and associated comments deleted");
                console.log(data);
            }).catch((err)=>{
                console.log(err);
            });
            // Post.findByIdAndDelete(req.user.id).then(data=>console.log(data)).catch(err=>console.log(err));

            Comment.deleteMany({
                post:req.params.id
            }).then((data)=>{
                return res.redirect('/');
        }).catch((err)=>{
            console.log(err);
        })
        }else{
            req.flash("error","You cannot delete this post");
            return res.redirect('back');
        }
    }).catch((err)=>{
        req.flash("error",err);
        console.log(err);
    })
}