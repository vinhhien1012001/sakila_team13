import logger from '../utils/logger/logger.js';
import util from 'util';

export default function (req, res, next) {
    // Log the request data
    // Log the request body (if it's a POST request)
    if (req.method === 'POST' || req.method === 'PUT') {
        logger.debug('Request Body:', util.inspect(req.body));
    }

    res.on('finish', () => {
        // Log the response data
        if(res.statusCode >= 400) {
            logger.error(`Response - Status: ${res.statusCode} - ${req.method}: ${req.originalUrl}`);
        } else {
            logger.info(`Response - Status: ${res.statusCode} - ${req.method}: ${req.originalUrl}`);
        }
    });

    next();
}