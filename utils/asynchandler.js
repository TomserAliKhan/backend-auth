const asynchandler = (handler) => {
    return (req, res, next) => {
        Promise.resolve(handler(req, res, next)).catch((err) => next(err));
    };
};

module.exports = asynchandler;