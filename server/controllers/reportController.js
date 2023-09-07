import asyncHandler from 'express-async-handler';
import Report from '../models/ReportModel.js';

const getReports = asyncHandler(async (req, res, next) => {
    const Reports = await Report.find();
    res.status(200).json({
        success: true,
        Reports: Reports
    });
});


export {getReports};