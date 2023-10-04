import * as nodemailer from 'nodemailer';
import Comment from '../models/commentModel.js';
import User from '../models/userModel.js';

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
    let tempPosts = [];
    for(let i = 0; i < posts.length; i++) {
        let post = posts[i];
        post = post._doc;
        let postUser = await User.findById(post.user).select('-password -__v -admin -updatedAt');
        if(userId && (userId.toString() in postUser.approved || userId.toString() === postUser._id.toString())) {
            post["approved"] = true;
            post["f_name"] = postUser["f_name"];
            post["l_name"] = postUser["l_name"];
        } else {
            post["approved"] = false;
        }
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
        tempPosts.push(post);
    }
    return tempPosts;
}

export { sendMail, countChar, addPostData };