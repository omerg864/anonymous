const errorHandler = (err, req, res, next) => {

    res.status(400).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? '(:' : err.stack
    });

}

export { errorHandler };