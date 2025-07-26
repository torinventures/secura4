/*
 * This file contains logger configuration and for the application
 *
 * Author: Aayush Gour
 */
const bunyan = require('bunyan');

const logRequestSerializer = (req) => {
    const requestLogParams = {
        type: 'REQUEST',
        method: req?.method?.toUpperCase(),
        path: req?.path,
        // headers: req?.headers,
    };
    return requestLogParams;
};

const logStreams = [
    ...process.env.LOG_DETAILS?.includes('file') ? [{
        type: 'rotating-file',
        path: process.env.LOG_FILE,
        period: process.env.LOG_ROTATION_PERIOD,
    }] : [],
    ...process.env.LOG_DETAILS?.includes('stdout') ? [{ stream: process.stdout }] : [],
];

const loggerConfig = {
    name: process.env.LOGGER_NAME,
    streams: logStreams,
    src: true,
    serializers: {
        req: logRequestSerializer,
    },
};

const log = bunyan.createLogger(loggerConfig);

const logger = log.child();

exports.logRequestSerializer = logRequestSerializer;
exports.log = log;
exports.logger = logger;
