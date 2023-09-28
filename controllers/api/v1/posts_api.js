const Post = require('../../../models/post');
const Comment = require('../../../models/comment');


module.exports.index = async function(req,res){
    let posts = await Post.find({}).sort('-createdAt').populate('user').populate({
        path: 'comments',
        populate:{
            path:'user'
        }
    });
    
    return res.json(200,{
        message: "List of posts",
        posts:posts
    })
}


module.exports.destroy = (req,res)=>{
    Post.findById(req.params.id).then((post)=>{

        if( post.user == req.user.id){
            Post.deleteMany({
                _id:req.params.id
            }).then((data)=>{
                // console.log(data);
            }).catch((err)=>{
                console.log(err);
            });
            // Post.findByIdAndDelete(req.user.id).then(data=>console.log(data)).catch(err=>console.log(err));

            Comment.deleteMany({
                post:req.params.id
            }).then((data)=>{
                return res.json(200,{
                    message:"Post and associated comments deleted succesfully!"
                });
        }).catch((err)=>{
            console.log(err);
        })
        }else{
           return res.json(401,{
            message:"Ypu cannot delete this post"
           })
        }
    }).catch((err)=>{
        return res.json(500,{
            message:"Internal server error!"
        });
        // req.flash("error",err);
        // console.log(err);
    })
}