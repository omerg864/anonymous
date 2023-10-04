import * as nodemailer from 'nodemailer';
import Comment from '../models/commentModel.js';

const sendMail = (receiver, subject, text) => {
    let mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_ADDRESS,
            pass: process.env.EMAIL_PASSWORD
        }
    });
     
    let mailDetails = {
        from: process.env.EMAIL_ADDRESS,
        to: receiver,
        subject: subject,
        text: text
    };
    mailTransporter.sendMail(mailDetails, function(err, data) {
        if(err) {
            console.log('Error Occurs');
        } else {
            console.log('Email sent successfully');
        }
    });
};

const countChar = (str, char) => {
    let count = 0;
    for(let i = 0; i < str.length; i++) {
        if(str[i] === char) {
            count++;
        }
    }
    return count;
}

const addPostData = async (posts, userId=undefined, savedPosts=undefined) => {
    for(let i = 0; i < posts.length; i++) {
        let post = posts[i];
        post = post._doc;
        if(userId && userId.toString() == post.user.toString()) {
            post["editable"] = true;
        } else {
            post["editable"] = false;
        }
        delete post["user"];
        if(userId && userId in post.likes) {
            post["liked"] = true;
        } else {
            post["liked"] = false;
        }
        post["likes"] = post["likes"].length;
        let comments = await Comment.find({post: post._id}).count();
        post["comments"] = comments;
        delete post["__v"];
        if(savedPosts && savedPosts.includes(post._id)) {
            post["saved"] = true;
        } else {
            post["saved"] = false;
        }
        posts[i] = post;
    }
}

export { sendMail, countChar, addPostData };