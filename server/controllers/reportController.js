import asyncHandler from 'express-async-handler';
import Report from '../models/reportModel.js';


const getReports = asyncHandler(async (req, res, next) => {
    const Reports = await Report.find();
    res.status(200).json({
        success: true,
        Reports: Reports
    });
});

const createReport = asyncHandler(async (req, res, next) => {
    const {description, userId, postId, commentId} = req.body;
    if(!description) {
        res.status(400);
        throw new Error('Invalid description');
    }
    let report;
    if(!userId && !postId && !commentId) {
        report = await Report.create({
            by: req.user._id,
            description
        });
    }
    if(userId) {
        report = await Report.create({
            by: req.user._id,
            description,
            userId
        })
    }
    else if(postId) {
        report = await Report.create({
            by: req.user._id,
            description,
            postId
        });
    }
    else if(commentId) {
        report = await Report.create({
            by: req.user._id,
            description,
            commentId
        });
    }
    res.status(200).json({
        success: true,
        report
    });
});


export {getReports, createReport};