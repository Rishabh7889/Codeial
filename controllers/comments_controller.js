const Comment = require('../models/comment')
const Post = require('../models/post');
const Like = require('../models/like');
const User = require('../models/user');
const commentsMailer = require('../mailers/comments_mailer');
const commentEmailWorker = require('../workers/comment_email_worker');
const queue = require('../config/kue');
// module.exports.create = (req,res)=>{
//     Post.findById(req.body.post).then((Post)=>{
//         Comment.create({
//             content:req.body.content,
//             post: req.body.post,
//             user:req.user._id
//         }).then((Comment)=>{
//             Post.findById(req.body.post).then((Post)=>{
//                 Post.comments.push(Comment);
//                 Post.save();
//             }).catch((err)=>{console.log(err)});

//             return res.redirect('/');
//         })
//     }).catch((err)=>{
//         console.log(err);
//     })
// }

module.exports.create = async (req, res) => {
  //   Post.findById(req.body.post).then((foundPost) => {
  //     Comment.create({
  //       content: req.body.content,
  //       post: req.body.post,
  //       user: req.user._id
  //     }).then((newComment) => {
  //       foundPost.comments.push(newComment);
  //       foundPost.save();
  //       console.log(newComment);

  //       newComment.save().then((createdComment) => {
  //         createdComment.populate('user','name email').execPopulate().then((mailCmment)=>{
  //           commentsMailer.newComment(mailCmment);
  //         });

  //       });
  //         req.flash('success',"Comment published");

  //         return res.redirect('/');
         
  //     }).catch((err) => {
  //       console.log(err);
  //     });
  //   }).catch((err) => {
  //     console.log(err);
  //     req.flash('error',err);
  //   });
  // }

  try{
    let post = await Post.findById(req.body.post);

  if(post){
    let comment =  await Comment.create({
            content: req.body.content,
            post: req.body.post,
            user: req.user._id
          });
    
    post.comments.push(comment);
    post.save();

    let job = queue.create('emails',comment).save(function(err){
      if(err){
        console.log("error in creating a queue");
        return;
      }

      console.log("Job enqueud",job.id);
    });
// -------------------------------------------------------------------------------------
    // console.log(post);
    // comment = await comment.populate('user','name email');
    // commentsMailer.newComment(comment);
    // User.findById(comment.user).then((user)=>{
    //   console.log(user)
      // commentsMailer.newComment(user,comment);
    // })

// =------------------------------------------------------------------------------------------


    console.log(comment.user);
    if(req.xhr){

      return res.status(200).json({
        data:{
          comment:comment
        },
        message: "Post created!"
      });
    }

    req.flash('success',"Comment published");

    res.redirect('/');
  }
  }catch(err){
    req.flash('error',err);
    return;
  }
}
  module.exports.destroy = function(req,res){
    Comment.findById(req.params.id).then((comment)=>{
      if(comment.user == req.user.id){
        let postId = comment.post;
        Comment.deleteMany({
          _id:req.params.id
      }).then((data)=>{
          console.log(data);
      }).catch((err)=>{
          console.log(err);
      });
      Post.findByIdAndUpdate(postId,{ $pull:{comments: req.params.id} }).then((data)=>{
        console.log(data);
        return res.redirect('back');
      }).catch((err)=>{
        console.log(err);
      })
      Like.deleteMany({likeable:comment._id,onModel:"Comment"});

      }else{
        res.redirect('back');
      }
    }).catch((err)=>{
      console.log(err);
    });
  }
  