import asyncHandler from 'express-async-handler';
import BanIp from '../models/BanIpModel.js';

const getBanIps = asyncHandler(async (req, res, next) => {
    const BanIps = await BanIp.find();
    res.status(200).json({
        success: true,
        BanIps: BanIps
    });
});


export {getBanIps};