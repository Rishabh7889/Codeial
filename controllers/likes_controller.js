const Like = require('../models/like');
const Comment = require('../models/comment');
const Post = require('../models/post');



module.exports.toggleLike = async function(req,res){
    try{
        // likes/toggle/?id=abcdef&type=Post

        let likeable;
        let deleted = false;
        

        if(req.query.type == 'Post'){
            likeable = await Post.findById(req.query.id).populate('likes');

        }else{
            likeable = await Comment.findById(req.query.id).populate('likes');

        }
        // console.log(likeable);
        //Check if like already exist
        let existingLike = await Like.findOne({
            likeable: req.query.id,
            user: req.user._id,
        })
        console.log(existingLike);
        //If like already exist then delete it.
        if(existingLike){
            likeable.likes.pull(existingLike._id);
            likeable.save();
            console.log()
            Like.deleteMany({
                likeable: req.query.id,
                user: req.user._id
            }).then((data)=>{
                console.log(data);
            });

            // deleted = true;

        }else{
            //Make a new like

            let newLike = await Like.create({
                user: req.user._id,
                likeable: req.query.id,
            })

            likeable.likes.push(newLike._id);

            likeable.save();


        }
        
        // res.json(200,{
        //     message: "Request successful",
        //     data:{
        //         deleted: deleted
        //     }
        // })
        return res.redirect('/');
    }catch(err){
        console.log(err);
        return res.json(500,{
            message: 'Internal Server Error'
        })
    }
}