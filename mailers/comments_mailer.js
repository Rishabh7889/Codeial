const nodeMailer = require('../config/nodemailer');
const User = require('../models/user');
// This is another way of exporting a method
exports.newComment = async (comment)=>{
    console.log('Inside new comment mailer');
    let user = await User.findById(comment.user);
    let htmlString = nodeMailer.renderTemplate({
        comment:comment,
        user:user
    },'/comments/new_comment.ejs');
    nodeMailer.transporter.sendMail({
        from: 'gargrishabh7889@gmail.com',
        to: user.email,
        subject: "New comment published on your post!",
        html:htmlString
        },(err,info)=>{
            if(err){
                console.log("Error in sending the mail",err);

                return;
            }
            console.log("Message delivered",info);
            return;
        }
    
    );
}
