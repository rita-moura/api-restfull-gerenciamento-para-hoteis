"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        error: {
            message,
            status: statusCode,
            timestamp: new Date().toISOString(),
            path: req.path,
            method: req.method
        },
        _links: [
            {
                href: `${req.protocol}://${req.get('host')}/`,
                rel: 'root',
                method: 'GET'
            }
        ]
    });
};
exports.errorHandler = errorHandler;
